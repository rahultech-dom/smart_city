# PowerShell Test Script: Sends sample payloads to all 6 Departmental Agent Webhooks
param(
  [string]$BaseUrl = "http://localhost:5678/webhook"
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host " Testing Smart City Departmental AI Agents Webhooks in n8n   " -ForegroundColor Cyan
Write-Host " Base URL: $BaseUrl" -ForegroundColor Gray
Write-Host "============================================================" -ForegroundColor Cyan

$agents = @(
  @{ Name = "Agent 3: Traffic Management Agent"; Endpoint = "$BaseUrl/traffic-agent"; File = "test_traffic.json" },
  @{ Name = "Agent 4: Public Safety Agent"; Endpoint = "$BaseUrl/public-safety-agent"; File = "test_safety.json" },
  @{ Name = "Agent 5: Waste Management Agent"; Endpoint = "$BaseUrl/waste-agent"; File = "test_waste.json" },
  @{ Name = "Agent 6: Environmental Monitoring Agent"; Endpoint = "$BaseUrl/environment-agent"; File = "test_environment.json" },
  @{ Name = "Agent 7: Water Management Agent"; Endpoint = "$BaseUrl/water-agent"; File = "test_water.json" },
  @{ Name = "Agent 8: Energy Management Agent"; Endpoint = "$BaseUrl/energy-agent"; File = "test_energy.json" }
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

foreach ($agent in $agents) {
  Write-Host "`n>>> Dispatching to $($agent.Name)..." -ForegroundColor Yellow
  $filePath = Join-Path $scriptDir $agent.File
  if (-not (Test-Path $filePath)) {
    Write-Host "Payload file not found: $filePath" -ForegroundColor Red
    continue
  }

  $bodyJson = Get-Content -Path $filePath -Raw
  try {
    $response = Invoke-RestMethod -Uri $agent.Endpoint -Method POST -Body $bodyJson -ContentType "application/json" -TimeoutSec 15
    Write-Host "[SUCCESS] Received Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host
  } catch {
    Write-Host "[ERROR] Could not connect to $($agent.Endpoint)" -ForegroundColor Red
    Write-Host "Details: $_" -ForegroundColor DarkRed
  }
}

Write-Host "`n============================================================" -ForegroundColor Cyan
Write-Host " All agent webhook dispatch tests completed." -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
