# Prepare the project for deployment by installing dependencies and building the frontend
param(
  [switch]$Clean
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Definition

if ($Clean) {
  Write-Host "Running clean first..."
  & powershell -NoProfile -ExecutionPolicy Bypass -File "$root\clean.ps1"
}

Write-Host "Installing root dependencies..."
npm install

Write-Host "Installing backend dependencies..."
Push-Location "$root\backend"
npm install
Pop-Location

Write-Host "Installing frontend dependencies..."
Push-Location "$root\frontend"
npm install

Write-Host "Building frontend..."
npm run build
Pop-Location

Write-Host "Deploy prep finished."
Write-Host "Frontend build output is available at frontend/dist."
Write-Host "Deploy the backend and frontend artifacts to your chosen host."
