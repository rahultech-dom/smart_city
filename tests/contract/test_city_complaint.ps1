# UrbanFlow AI - City Complaint Agent Contract Test Suite
# Tests WF_City_Complaint against SPEC.md Section 5 & Section 3

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " UrbanFlow AI: Member 2 Contract Test Suite (PowerShell)" -ForegroundColor Cyan
Write-Host " Testing WF_City_Complaint Workflow and Contracts" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoDir = Split-Path -Parent (Split-Path -Parent $scriptDir)
$workflowPath = Join-Path $repoDir "workflows\WF_City_Complaint.json"
$vectorsPath = Join-Path $scriptDir "test_vectors.json"

$passed = 0
$failed = 0

function Assert-Test([string]$name, [bool]$condition, [string]$message = "") {
    if ($condition) {
        Write-Host " [PASS] $name" -ForegroundColor Green
        $script:passed++
    } else {
        Write-Host " [FAIL] $name - $message" -ForegroundColor Red
        $script:failed++
    }
}

# ---------------------------------------------------------
# Test Group 1: Workflow Structure & Syntax Verification
# ---------------------------------------------------------
Write-Host "`n--- Test Group 1: Workflow File Integrity ---" -ForegroundColor Yellow

$workflowContent = Get-Content -Raw -Path $workflowPath
$workflowJson = $workflowContent | ConvertFrom-Json

Assert-Test "Workflow file exists and is valid JSON" ($null -ne $workflowJson)
Assert-Test "Exact workflow name is 'WF_City_Complaint'" ($workflowJson.name -eq "WF_City_Complaint")

$nodeNames = $workflowJson.nodes | ForEach-Object { $_.name }
Assert-Test "Contains 'Webhook Intake' node" ($nodeNames -contains "Webhook Intake")
Assert-Test "Contains 'Sub-workflow Trigger' node" ($nodeNames -contains "Sub-workflow Trigger")
Assert-Test "Contains 'Validate & Normalize Input' node" ($nodeNames -contains "Validate & Normalize Input")
Assert-Test "Contains 'Is Input Valid?' node" ($nodeNames -contains "Is Input Valid?")
Assert-Test "Contains 'Reject Invalid Input' node" ($nodeNames -contains "Reject Invalid Input")
Assert-Test "Contains 'Classify & Assess Severity' node" ($nodeNames -contains "Classify & Assess Severity")
Assert-Test "Contains 'Format Complaint Record' node" ($nodeNames -contains "Format Complaint Record")
Assert-Test "Contains 'Save to Supabase' node" ($nodeNames -contains "Save to Supabase")
Assert-Test "Contains 'Forward to City Command Agent' node" ($nodeNames -contains "Forward to City Command Agent")
Assert-Test "Contains 'Respond to Citizen Caller' node" ($nodeNames -contains "Respond to Citizen Caller")

# ---------------------------------------------------------
# Test Group 2: Simulation of Member 2 Logic with Test Vectors
# ---------------------------------------------------------
Write-Host "`n--- Test Group 2: Contract & Logic Test Vectors ---" -ForegroundColor Yellow

$vectorsJson = (Get-Content -Raw -Path $vectorsPath) | ConvertFrom-Json

# Helper simulation functions mirroring WF_City_Complaint logic
function Simulate-ValidateAndNormalize($raw) {
    $desc = $raw.description
    if ($null -eq $desc -or (-not ($desc -is [string]))) {
        return @{ valid = $false; error_code = "VALIDATION_ERROR"; message = "The complaint description is required and must be text." }
    }
    $trimmed = $desc.Trim()
    if ($trimmed.Length -eq 0) {
        return @{ valid = $false; error_code = "VALIDATION_ERROR"; message = "The complaint description cannot be empty." }
    }

    $allowedSources = @('citizen_complaint', 'simulated_sensor', 'admin')
    $source = if ($raw.source) { $raw.source } else { 'citizen_complaint' }
    if ($allowedSources -notcontains $source) {
        return @{ valid = $false; error_code = "VALIDATION_ERROR"; message = "Invalid source" }
    }

    $lat = if ($null -ne $raw.latitude) { [double]$raw.latitude } else { $null }
    $lon = if ($null -ne $raw.longitude) { [double]$raw.longitude } else { $null }
    $hasCoords = ($null -ne $lat -and $null -ne $lon)

    $complaintId = if ($raw.complaint_id) { $raw.complaint_id } else { [guid]::NewGuid().ToString() }
    $eventId = if ($raw.event_id) { $raw.event_id } else { [guid]::NewGuid().ToString() }

    return @{
        valid = $true
        complaint_id = $complaintId
        event_id = $eventId
        citizen_name = if ($raw.citizen_name) { $raw.citizen_name } else { 'Demo Citizen' }
        description = $trimmed
        category = $raw.category
        latitude = $lat
        longitude = $lon
        has_coordinates = $hasCoords
        source = $source
        status = "submitted"
    }
}

function Simulate-ClassifyAndAssess($item) {
    $desc = $item.description.ToLower()
    $category = $item.category
    $allowedDepts = @('traffic', 'safety', 'waste', 'environment', 'water', 'energy', 'general')

    if ($null -eq $category -or ($allowedDepts -notcontains $category.ToLower())) {
        if ($desc -match '\b(active fire|life threat|explosion|theft|assault|crime|safety|harassment|vandalism|weapon|suspicious|violence|emergency|structural collapse)\b') {
            $category = 'safety'
        } elseif ($desc -match '\b(traffic|traffic jam|congestion|traffic lights?|traffic signals?|road block|pothole|car crash|accident|intersection|lane|speeding|pedestrian crossing)\b') {
            $category = 'traffic'
        } elseif ($desc -match '\b(water|pipe|leak|drain|drainage|waterlogging|flooding|supply|sewage|sewer|contamination|burst)\b') {
            $category = 'water'
        } elseif ($desc -match '\b(garbage|trash|bin|bins|waste|dump|rubbish|litter|sanitation|collection|recycling)\b') {
            $category = 'waste'
        } elseif ($desc -match '\b(electricity|power|blackout|outage|street ?lights?|spark|wire|pole|transformer|voltage)\b') {
            $category = 'energy'
        } elseif ($desc -match '\b(air quality|pollution|smoke|smog|aqi|noise|odor|odour|chemical|toxic|dust|tree falling|emission)\b') {
            $category = 'environment'
        } else {
            $category = 'general'
        }
    }

    $severity = 'medium'
    if ($desc -match '\b(life threat|immediate danger|explosion|live wire touching|active fire|drowning|fatal|gas leak emergency)\b') {
        $severity = 'critical'
    } elseif ($desc -match '\b(major accident|broken water main|sparking transformer|severe flooding|hazardous waste|open manhole)\b') {
        $severity = 'high'
    } elseif ($desc -match '\b(overflow|leaking tap|flickering light|litter|pothole|delayed garbage|dirty road|illegal parking)\b') {
        $severity = 'medium'
    } elseif ($desc -match '\b(cosmetic|faded paint|minor graffiti|mild smell|small puddle|routine query)\b') {
        $severity = 'low'
    } else {
        $severity = 'medium'
    }

    $item.category = $category
    $item.assigned_department = $category
    $item.severity = $severity
    $item.status = 'submitted'
    return $item
}

foreach ($tc in $vectorsJson.test_cases) {
    $norm = Simulate-ValidateAndNormalize $tc.input
    if (-not $tc.expected.valid) {
        Assert-Test "$($tc.id): Rejects invalid input" (-not $norm.valid)
        if ($tc.expected.error_code) {
            Assert-Test "$($tc.id): Returns correct error_code" ($norm.error_code -eq $tc.expected.error_code)
        }
    } else {
        Assert-Test "$($tc.id): Validates input successfully" ($norm.valid -eq $true)
        $classified = Simulate-ClassifyAndAssess $norm

        if ($tc.expected.category) {
            Assert-Test "$($tc.id): Classified as $($tc.expected.category)" ($classified.category -eq $tc.expected.category)
        }
        if ($tc.expected.severity) {
            Assert-Test "$($tc.id): Severity assigned as $($tc.expected.severity)" ($classified.severity -eq $tc.expected.severity)
        }
        if ($tc.expected.status) {
            Assert-Test "$($tc.id): Initial status is $($tc.expected.status)" ($classified.status -eq $tc.expected.status)
        }
        if ($null -ne $tc.expected.has_coordinates) {
            Assert-Test "$($tc.id): has_coordinates matches" ($classified.has_coordinates -eq $tc.expected.has_coordinates)
        }
        if ($tc.expected.complaint_id) {
            Assert-Test "$($tc.id): Preserves complaint_id idempotently" ($classified.complaint_id -eq $tc.expected.complaint_id)
        }
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " Test Summary: $passed Passed, $failed Failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })
Write-Host "==========================================================" -ForegroundColor Cyan

if ($failed -gt 0) {
    exit 1
}
