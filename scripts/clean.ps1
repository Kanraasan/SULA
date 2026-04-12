# Clean build artifacts and dependencies for the monorepo
param(
  [switch]$RemoveNodeModules = $true
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
$paths = @(
  "$root\frontend\dist",
  "$root\frontend\.vite",
  "$root\frontend\node_modules",
  "$root\backend\node_modules",
  "$root\node_modules"
)

foreach ($path in $paths) {
  if (Test-Path $path) {
    Write-Host "Removing: $path"
    Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "Clean complete."
