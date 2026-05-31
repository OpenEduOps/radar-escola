$ErrorActionPreference = "Stop"

$bundlePath = Join-Path $PSScriptRoot "..\src-tauri\target\release\bundle"

if (-not (Test-Path -LiteralPath $bundlePath)) {
    throw "Bundle directory was not found: $bundlePath"
}

$installers = Get-ChildItem -Path $bundlePath -Recurse -File |
    Where-Object { $_.Extension -in ".msi", ".exe" }

if (-not $installers) {
    throw "No Windows installer artifact was found under $bundlePath"
}

Write-Host "Windows installer smoke check passed."
$installers | ForEach-Object {
    Write-Host "- $($_.FullName)"
}
