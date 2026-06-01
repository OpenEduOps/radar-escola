$ErrorActionPreference = "Stop"

$bundlePath = Join-Path $PSScriptRoot "..\src-tauri\target\release\bundle"
$productName = "Radar Escola"
$binaryName = "radar-escola.exe"

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

function Assert-AppStarts {
    param(
        [Parameter(Mandatory = $true)]
        [System.IO.FileInfo]
        $Executable
    )

    Write-Host "Starting $($Executable.FullName)"

    $process = Start-Process -FilePath $Executable.FullName -PassThru
    Start-Sleep -Seconds 8

    if ($process.HasExited) {
        throw "Installed app exited during smoke test with code $($process.ExitCode)."
    }

    Stop-Process -Id $process.Id -Force
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
    Assert-AppStarts -Executable $installedApp
    Write-Host "Windows installer smoke check passed."
}
finally {
    Clear-InstalledApp
}
