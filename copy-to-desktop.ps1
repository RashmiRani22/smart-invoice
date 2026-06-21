$dest = Join-Path ([Environment]::GetFolderPath('Desktop')) 'smart-invoice-gst-generator'
if (-Not (Test-Path $dest)) {
  New-Item -ItemType Directory -Path $dest | Out-Null
}
Copy-Item -Path "$PSScriptRoot\*" -Destination $dest -Recurse -Force -ErrorAction Stop
Write-Host "COPIED $dest"
