# UCHI Installation Script for Windows PowerShell
# This script helps you set up the backend dependencies

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host "  UCHI Backend Installation Script" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "[1/3] Creating .env file..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "      ✓ Created .env from .env.example" -ForegroundColor Green
        Write-Host "      ⚠️  IMPORTANT: Edit .env and add your Supabase credentials!" -ForegroundColor Red
        Write-Host ""
    } else {
        Write-Host "      ⚠️  .env.example not found. Creating blank .env..." -ForegroundColor Yellow
        @"
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Host "      ✓ Created .env file" -ForegroundColor Green
        Write-Host "      ⚠️  IMPORTANT: Edit .env and add your Supabase credentials!" -ForegroundColor Red
        Write-Host ""
    }
} else {
    Write-Host "[1/3] .env file already exists ✓" -ForegroundColor Green
    Write-Host ""
}

# Install minimal dependencies
Write-Host "[2/3] Installing Python dependencies..." -ForegroundColor Yellow
Write-Host "      This installs: Flask, flask-cors, python-dotenv, supabase" -ForegroundColor Gray
Write-Host ""

$packages = @(
    "Flask==3.0.0",
    "flask-cors==4.0.0",
    "python-dotenv==1.0.0",
    "supabase==2.3.4"
)

foreach ($package in $packages) {
    Write-Host "      Installing $package..." -ForegroundColor Cyan
    pip install $package --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Host "      ✓ $package installed" -ForegroundColor Green
    } else {
        Write-Host "      ✗ Failed to install $package" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "[3/3] Verifying installation..." -ForegroundColor Yellow

# Test imports
$testScript = @"
import sys
try:
    import flask
    import flask_cors
    from dotenv import load_dotenv
    from supabase import create_client
    print('ALL_OK')
except ImportError as e:
    print(f'IMPORT_ERROR: {e}')
    sys.exit(1)
"@

$result = python -c $testScript 2>&1

if ($result -like "*ALL_OK*") {
    Write-Host "      ✓ All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "      ✗ Some dependencies may be missing:" -ForegroundColor Red
    Write-Host "        $result" -ForegroundColor Gray
}

Write-Host ""
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host "  Installation Complete!" -ForegroundColor Green
Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 58) -ForegroundColor Cyan
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Edit .env file with your Supabase credentials" -ForegroundColor White
Write-Host "     (Get them from: Supabase Dashboard → Settings → API)" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Run the backend:" -ForegroundColor White
Write-Host "     python app.py" -ForegroundColor Cyan
Write-Host ""
Write-Host "  3. Open another terminal and run the frontend:" -ForegroundColor White
Write-Host "     cd ..\frontend" -ForegroundColor Cyan
Write-Host "     npm install" -ForegroundColor Cyan
Write-Host "     npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 For detailed setup instructions, see: SUPABASE_SETUP.md" -ForegroundColor Blue
Write-Host ""
