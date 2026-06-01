$ErrorActionPreference = "Stop"

$bundlePath = Join-Path $PSScriptRoot "..\src-tauri\target\release\bundle"
$productName = "Radar Escola"
$binaryName = "radar-escola.exe"

Add-Type @"
using System;
using System.Runtime.InteropServices;

public static class RadarEscolaSmokeWin32
{
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

function Invoke-PlaygroundMenu {
    param(
        [Parameter(Mandatory = $true)]
        [IntPtr]
        $WindowHandle
    )

    $menu = [RadarEscolaSmokeWin32]::GetMenu($WindowHandle)

    if ($menu -eq [IntPtr]::Zero) {
        throw "Application menu was not found during smoke test."
    }

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
        $WindowHandle,
        0x0111,
        [IntPtr]([int]$commandId),
        [IntPtr]::Zero
    ) | Out-Null
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
        Invoke-PlaygroundMenu -WindowHandle $mainWindow
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
    Assert-AppLaunchFlow -Executable $installedApp
    Write-Host "Windows installer smoke check passed."
}
finally {
    Clear-InstalledApp
}
