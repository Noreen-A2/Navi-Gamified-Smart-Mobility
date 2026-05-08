param(
    [int[]]$Ports = @(8000, 8081, 8082)
)

$repoRoot = $PSScriptRoot
$backendDir = Join-Path $repoRoot "apps\backend"
$mobileDir = Join-Path $repoRoot "apps\mobile"

function Stop-PortProcess {
    param([int]$Port)

    $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $connections) {
        return
    }

    $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($processId in $processIds) {
        try {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        } catch {
        }
    }
}

foreach ($port in $Ports) {
    Stop-PortProcess -Port $port
}

if (-not (Test-Path $backendDir)) {
    Write-Host "Backend folder not found: $backendDir" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $mobileDir)) {
    Write-Host "Mobile folder not found: $mobileDir" -ForegroundColor Red
    exit 1
}

$backendCmd = "Set-Location `"$backendDir`"; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --app-dir `"$backendDir`""
$mobileCmd = "Set-Location `"$mobileDir`"; npm run start"

Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $mobileCmd | Out-Null

Write-Host "Started backend (8000) and Expo (8081/8082)." -ForegroundColor Green
