# Export MySQL Database Script for Railway Deployment

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "MySQL Database Export Tool" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$dbName = "outfit_recommendation_db"
$username = "root"
$password = "ProjectMCA@123"
$outputFile = "database_export_$(Get-Date -Format 'yyyy-MM-dd_HHmmss').sql"

# Try to find MySQL installation
$mysqlLocations = @(
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 8.1\bin\mysqldump.exe",
    "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqldump.exe",
    "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysqldump.exe",
    "C:\xampp\mysql\bin\mysqldump.exe",
    "C:\wamp64\bin\mysql\mysql8.0.0\bin\mysqldump.exe",
    "mysqldump.exe"
)

$mysqldumpPath = $null
foreach ($location in $mysqlLocations) {
    if (Test-Path $location -ErrorAction SilentlyContinue) {
        $mysqldumpPath = $location
        Write-Host "✓ Found mysqldump at: $location" -ForegroundColor Green
        break
    }
}

if (-not $mysqldumpPath) {
    # Try to find in PATH
    $mysqldumpPath = Get-Command mysqldump -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
}

if (-not $mysqldumpPath) {
    Write-Host "✗ mysqldump not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solutions:" -ForegroundColor Yellow
    Write-Host "1. Manual Export via MySQL Workbench:" -ForegroundColor Cyan
    Write-Host "   - Open MySQL Workbench" -ForegroundColor White
    Write-Host "   - Connect to your database" -ForegroundColor White
    Write-Host "   - Server > Data Export" -ForegroundColor White
    Write-Host "   - Select 'outfit_recommendation_db'" -ForegroundColor White
    Write-Host "   - Export to Self-Contained File" -ForegroundColor White
    Write-Host "   - Save as: database_export.sql" -ForegroundColor White
    Write-Host ""
    Write-Host "2. Or locate your MySQL bin folder and run:" -ForegroundColor Cyan
    Write-Host '   & "C:\Path\To\MySQL\bin\mysqldump.exe" -u root -pProjectMCA@123 --databases outfit_recommendation_db > database_export.sql' -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Database: $dbName" -ForegroundColor White
Write-Host "Output file: $outputFile" -ForegroundColor White
Write-Host ""
Write-Host "Exporting database..." -ForegroundColor Yellow

# Export command with proper quoting
try {
    $arguments = "-u", $username, "-p$password", "--databases", $dbName, "--add-drop-database", "--routines", "--triggers", "--events"
    
    & $mysqldumpPath $arguments | Out-File -FilePath $outputFile -Encoding UTF8
    
    if (Test-Path $outputFile) {
        $fileSize = (Get-Item $outputFile).Length / 1KB
        Write-Host ""
        Write-Host "✓ Database exported successfully!" -ForegroundColor Green
        Write-Host "✓ File: $outputFile" -ForegroundColor Green
        Write-Host "✓ Size: $([math]::Round($fileSize, 2)) KB" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Keep this SQL file safe" -ForegroundColor White
        Write-Host "2. Use Railway CLI or MySQL Workbench to import to Railway MySQL" -ForegroundColor White
        Write-Host "3. See RAILWAY_DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor White
    } else {
        Write-Host "✗ Export failed - file not created" -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "✗ Export failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Verify MySQL is running" -ForegroundColor White
    Write-Host "2. Check username and password in this script" -ForegroundColor White
    Write-Host "3. Verify database name is correct" -ForegroundColor White
    Write-Host "4. Ensure you have proper permissions" -ForegroundColor White
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
