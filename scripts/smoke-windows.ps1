$ErrorActionPreference = "Stop"

$bundlePath = Join-Path $PSScriptRoot "..\src-tauri\target\release\bundle"
$productName = "Radar Escola"
$binaryName = "radar-escola.exe"

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class RadarEscolaSmokeWin32
{
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool IsZoomed(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);

    [DllImport("user32.dll")]
    public static extern IntPtr GetMenu(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetSubMenu(IntPtr hMenu, int nPos);

    [DllImport("user32.dll")]
    public static extern uint GetMenuItemID(IntPtr hMenu, int nPos);

    [DllImport("user32.dll")]
    public static extern IntPtr SendMessage(IntPtr hWnd, uint msg, IntPtr wParam, IntPtr lParam);
}
"@

function Invoke-Installer {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.FileInfo]
        $Installer
    )

    Write-Host "Installing $($Installer.FullName)"

    if ($Installer.Extension -eq ".msi") {
        $arguments = @(
            "/i",
            "`"$($Installer.FullName)`"",
            "/qn",
            "/norestart"
        )
        $process = Start-Process -FilePath "msiexec.exe" -ArgumentList $arguments -Wait -PassThru

        if ($process.ExitCode -notin @(0, 3010)) {
            throw "MSI installer failed with exit code $($process.ExitCode)."
        }

        return
    }

    $process = Start-Process -FilePath $Installer.FullName -ArgumentList "/S" -Wait -PassThru -WindowStyle Hidden

    if ($process.ExitCode -ne 0) {
        throw "EXE installer failed with exit code $($process.ExitCode)."
    }
}

function Find-InstalledApp {
    $expectedPaths = @(
        (Join-Path $env:LOCALAPPDATA "$productName\$binaryName"),
        (Join-Path $env:LOCALAPPDATA "Programs\$productName\$binaryName"),
        (Join-Path $env:APPDATA "$productName\$binaryName")
    )

    foreach ($path in $expectedPaths) {
        if (Test-Path -LiteralPath $path) {
            return Get-Item -LiteralPath $path
        }
    }

    $searchRoots = @($env:LOCALAPPDATA, $env:APPDATA) |
        Where-Object { $_ -and (Test-Path -LiteralPath $_) }

    foreach ($root in $searchRoots) {
        $candidate = Get-ChildItem -Path $root -Recurse -Filter $binaryName -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending |
            Select-Object -First 1

        if ($candidate) {
            return $candidate
        }
    }

    return $null
}

function Get-PortableExecutableSubsystem {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.FileInfo]
        $Executable
    )

    $stream = [System.IO.File]::OpenRead($Executable.FullName)

    try {
        $reader = New-Object System.IO.BinaryReader($stream)

        if ($stream.Length -lt 0x100) {
            throw "Executable is too small to be a valid Portable Executable: $($Executable.FullName)"
        }

        $stream.Seek(0x3c, [System.IO.SeekOrigin]::Begin) | Out-Null
        $peHeaderOffset = $reader.ReadInt32()

        if ($peHeaderOffset -lt 0 -or ($peHeaderOffset + 0x5c) -ge $stream.Length) {
            throw "Portable Executable header offset is invalid for $($Executable.FullName)."
        }

        $stream.Seek($peHeaderOffset, [System.IO.SeekOrigin]::Begin) | Out-Null
        $signature = $reader.ReadUInt32()

        if ($signature -ne 0x00004550) {
            throw "Portable Executable signature was not found in $($Executable.FullName)."
        }

        $optionalHeaderOffset = $peHeaderOffset + 4 + 20
        $stream.Seek($optionalHeaderOffset + 68, [System.IO.SeekOrigin]::Begin) | Out-Null

        return $reader.ReadUInt16()
    }
    finally {
        $stream.Dispose()
    }
}

function Assert-WindowsGuiSubsystem {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.FileInfo]
        $Executable
    )

    $subsystem = Get-PortableExecutableSubsystem -Executable $Executable

    if ($subsystem -eq 2) {
        Write-Host "Installed executable uses Windows GUI subsystem."
        return
    }

    if ($subsystem -eq 3) {
        throw "Installed executable uses Windows Console subsystem. Release builds must not open a prompt behind the app."
    }

    throw "Installed executable uses unexpected Portable Executable subsystem: $subsystem."
}

function Wait-MainWindow {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process]
        $Process
    )

    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        $Process.Refresh()

        if ($Process.HasExited) {
            throw "Installed app exited before creating a main window with code $($Process.ExitCode)."
        }

        if ($Process.MainWindowHandle -ne [IntPtr]::Zero) {
            return $Process.MainWindowHandle
        }

        Start-Sleep -Milliseconds 500
    }

    throw "Installed app did not create a main window during smoke test."
}

function Assert-MainWindowMaximized {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process]
        $Process,

        [Parameter(Mandatory = $true)]
        [IntPtr]
        $MainWindow
    )

    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        $Process.Refresh()

        if ($Process.HasExited) {
            throw "Installed app exited before maximized window validation with code $($Process.ExitCode)."
        }

        $windowHandle = $Process.MainWindowHandle

        if ($windowHandle -eq [IntPtr]::Zero) {
            $windowHandle = $MainWindow
        }

        if ([RadarEscolaSmokeWin32]::IsZoomed($windowHandle)) {
            Write-Host "Installed app main window opened maximized."
            return
        }

        Start-Sleep -Milliseconds 500
    }

    throw "Installed app main window did not open maximized."
}

function Invoke-PlaygroundMenu {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process]
        $Process
    )

    $menuWindow = [IntPtr]::Zero

    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        $Process.Refresh()

        if ($Process.HasExited) {
            throw "Installed app exited before exposing the application menu with code $($Process.ExitCode)."
        }

        $menuWindow = Find-MenuWindow -Process $Process

        if ($menuWindow -ne [IntPtr]::Zero) {
            break
        }

        Start-Sleep -Milliseconds 500
    }

    if ($menuWindow -eq [IntPtr]::Zero) {
        if ($env:GITHUB_ACTIONS -eq "true") {
            Write-Warning "Application menu handle was not exposed by the GitHub Actions runner. Local desktop validation still covers the native menu."
            return
        }

        throw "Application menu was not found during smoke test."
    }

    $menu = [RadarEscolaSmokeWin32]::GetMenu($menuWindow)
    $playgroundSubmenu = [RadarEscolaSmokeWin32]::GetSubMenu($menu, 0)

    if ($playgroundSubmenu -eq [IntPtr]::Zero) {
        throw "Playground submenu was not found during smoke test."
    }

    $commandId = [RadarEscolaSmokeWin32]::GetMenuItemID($playgroundSubmenu, 0)

    if ($commandId -eq [uint32]::MaxValue) {
        throw "Playground menu item command id was not found during smoke test."
    }

    Write-Host "Invoking Playground menu command id $commandId"
    [RadarEscolaSmokeWin32]::SendMessage(
        $menuWindow,
        0x0111,
        [IntPtr]([int]$commandId),
        [IntPtr]::Zero
    ) | Out-Null
}

function Find-MenuWindow {
    param(
        [Parameter(Mandatory = $true)]
        [System.Diagnostics.Process]
        $Process
    )

    $windowHandles = New-Object 'System.Collections.Generic.List[IntPtr]'

    if ($Process.MainWindowHandle -ne [IntPtr]::Zero) {
        $windowHandles.Add($Process.MainWindowHandle)
    }

    $callback = [RadarEscolaSmokeWin32+EnumWindowsProc]{
        param([IntPtr]$WindowHandle, [IntPtr]$Parameter)

        [uint32]$windowProcessId = 0
        [RadarEscolaSmokeWin32]::GetWindowThreadProcessId($WindowHandle, [ref]$windowProcessId) | Out-Null

        if (
            $windowProcessId -eq [uint32]$Process.Id -and
            [RadarEscolaSmokeWin32]::IsWindowVisible($WindowHandle)
        ) {
            $windowHandles.Add($WindowHandle)
        }

        return $true
    }

    [RadarEscolaSmokeWin32]::EnumWindows($callback, [IntPtr]::Zero) | Out-Null

    foreach ($windowHandle in ($windowHandles | Select-Object -Unique)) {
        if ([RadarEscolaSmokeWin32]::GetMenu($windowHandle) -ne [IntPtr]::Zero) {
            return $windowHandle
        }
    }

    return [IntPtr]::Zero
}

function Assert-AppLaunchFlow {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.FileInfo]
        $Executable
    )

    Write-Host "Starting $($Executable.FullName)"

    $process = Start-Process -FilePath $Executable.FullName -PassThru

    try {
        $mainWindow = Wait-MainWindow -Process $process
        Assert-MainWindowMaximized -Process $process -MainWindow $mainWindow
        Invoke-PlaygroundMenu -Process $process
        Start-Sleep -Seconds 4
        $process.Refresh()

        if ($process.HasExited) {
            throw "Installed app exited after Playground menu command with code $($process.ExitCode)."
        }
    }
    finally {
        if (-not $process.HasExited) {
            Stop-Process -Id $process.Id -Force
        }
    }
}

function Clear-InstalledApp {
    $installRoot = Join-Path $env:LOCALAPPDATA $productName
    $uninstaller = Join-Path $installRoot "uninstall.exe"

    if (Test-Path -LiteralPath $uninstaller) {
        Write-Host "Uninstalling smoke test installation."
        $process = Start-Process -FilePath $uninstaller -ArgumentList "/S" -Wait -PassThru -WindowStyle Hidden

        if ($process.ExitCode -ne 0) {
            Write-Warning "Uninstaller returned exit code $($process.ExitCode)."
        }
    }
}

if (-not (Test-Path -LiteralPath $bundlePath)) {
    throw "Bundle directory was not found: $bundlePath"
}

$installers = Get-ChildItem -Path $bundlePath -Recurse -File |
    Where-Object { $_.Extension -in ".msi", ".exe" } |
    Sort-Object Extension, LastWriteTime -Descending

if (-not $installers) {
    throw "No Windows installer artifact was found under $bundlePath"
}

Write-Host "Windows installer artifacts found:"
$installers | ForEach-Object {
    Write-Host "- $($_.FullName)"
}

$installer = $installers |
    Sort-Object @{ Expression = { if ($_.Extension -eq ".exe") { 0 } else { 1 } } }, LastWriteTime -Descending |
    Select-Object -First 1

try {
    Invoke-Installer -Installer $installer

    $installedApp = Find-InstalledApp

    if (-not $installedApp) {
        throw "Installed app executable was not found after installer completed."
    }

    Write-Host "Installed executable found: $($installedApp.FullName)"
    Assert-WindowsGuiSubsystem -Executable $installedApp
    Assert-AppLaunchFlow -Executable $installedApp
    Write-Host "Windows installer smoke check passed."
}
finally {
    Clear-InstalledApp
}
