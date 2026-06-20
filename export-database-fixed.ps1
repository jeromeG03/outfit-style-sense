# Export MySQL Database Script for Railway Deployment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "MySQL Database Export Tool" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$dbName = "outfit_recommendation_db"
$username = "root"
$password = "ProjectMCA@123"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$outputFile = "database_export_$timestamp.sql"

# Try to find MySQL installation
$mysqlLocations = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
    "C:\xampp\mysql\bin\mysqldump.exe",
    "C:\wamp64\bin\mysql\mysql8.0.0\bin\mysqldump.exe"
)

$mysqldumpPath = $null
foreach ($location in $mysqlLocations) {
    if (Test-Path $location) {
        $mysqldumpPath = $location
        Write-Host "Found mysqldump at: $location" -ForegroundColor Green
        break
    }
}

# Try PATH if not found
if (-not $mysqldumpPath) {
    $pathCmd = Get-Command mysqldump -ErrorAction SilentlyContinue
    if ($pathCmd) {
        $mysqldumpPath = $pathCmd.Source
        Write-Host "Found mysqldump in PATH: $mysqldumpPath" -ForegroundColor Green
    }
}

if (-not $mysqldumpPath) {
    Write-Host "ERROR: mysqldump not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "=== SOLUTION: Use MySQL Workbench ===" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Open MySQL Workbench" -ForegroundColor Cyan
    Write-Host "2. Connect to your local database" -ForegroundColor Cyan
    Write-Host "3. Go to: Server -> Data Export" -ForegroundColor Cyan
    Write-Host "4. Select schema: outfit_recommendation_db" -ForegroundColor Cyan
    Write-Host "5. Choose: Export to Self-Contained File" -ForegroundColor Cyan
    Write-Host "6. Click 'Start Export'" -ForegroundColor Cyan
    Write-Host "7. Save as: database_export.sql" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "Database: $dbName" -ForegroundColor White
Write-Host "Output: $outputFile" -ForegroundColor White
Write-Host ""
Write-Host "Exporting..." -ForegroundColor Yellow

# Build arguments array
$arguments = @(
    "-u$username",
    "-p$password",
    "--databases", $dbName,
    "--add-drop-database",
    "--routines",
    "--triggers",
    "--events"
)

# Execute export
try {
    & $mysqldumpPath $arguments | Out-File -FilePath $outputFile -Encoding UTF8
    
    if (Test-Path $outputFile) {
        $fileSize = (Get-Item $outputFile).Length / 1KB
        
        if ($fileSize -gt 1) {
            Write-Host ""
            Write-Host "SUCCESS! Database exported" -ForegroundColor Green
            Write-Host "File: $outputFile" -ForegroundColor Green
            Write-Host "Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next: Import this to Railway MySQL" -ForegroundColor Cyan
            Write-Host "See: RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
        } else {
            Write-Host ""
            Write-Host "WARNING: Export file is very small or empty" -ForegroundColor Yellow
            Write-Host "This might indicate an error" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "Try MySQL Workbench instead (see instructions above)" -ForegroundColor Yellow
        }
    } else {
        Write-Host ""
        Write-Host "ERROR: Export file not created" -ForegroundColor Red
        Write-Host "Try MySQL Workbench instead" -ForegroundColor Yellow
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Export failed" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try MySQL Workbench instead (see instructions above)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
