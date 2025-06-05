# Verify Auto-Minting Configuration
# This script checks if the automatic token minting system is properly configured.

# Check environment variables file
Write-Host "🔍 Checking auto-minting configuration..." -ForegroundColor Cyan

$envFile = ".\.env.local"
$envPath = Join-Path "$PSScriptRoot\rwa-frontend" $envFile

if (-not (Test-Path $envPath)) {
    Write-Host "❌ Environment file not found: $envFile" -ForegroundColor Red
    Write-Host "   Please create this file in the rwa-frontend directory with required credentials." -ForegroundColor Yellow
    exit 1
}

# Check for required configuration variables
$envContent = Get-Content $envPath -Raw
$requiredVars = @(
    "CONTRACT_ADMIN_PUBLIC_KEY",
    "CONTRACT_ADMIN_SECRET_KEY",
    "STELLAR_NETWORK"
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if ($envContent -notmatch "$var=\S+") {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "⚠️ Missing required environment variables:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var" -ForegroundColor Yellow
    }
    Write-Host "Please update $envFile with these variables." -ForegroundColor Yellow
}
else {
    Write-Host "✅ Environment variables configured" -ForegroundColor Green
}

# Check for API endpoints
$apiFiles = @(
    "app\api\mint-tokens\route.ts",
    "app\api\queue-mint\route.ts"
)

$missingApis = @()
foreach ($api in $apiFiles) {
    $apiPath = Join-Path "$PSScriptRoot\rwa-frontend" $api
    if (-not (Test-Path $apiPath)) {
        $missingApis += $api
    }
}

if ($missingApis.Count -gt 0) {
    Write-Host "❌ Missing API implementation files:" -ForegroundColor Red
    foreach ($api in $missingApis) {
        Write-Host "   - $api" -ForegroundColor Red
    }
    Write-Host "Please create these files to enable automatic token minting." -ForegroundColor Yellow
}
else {
    Write-Host "✅ API endpoints implemented" -ForegroundColor Green
}

# Extract admin public key for testing
$adminPublicKey = ""
if ($envContent -match 'CONTRACT_ADMIN_PUBLIC_KEY=([^"\r\n]+)') {
    $adminPublicKey = $matches[1]
    
    # Check if it's a placeholder
    if ($adminPublicKey -match 'YOUR_ADMIN|PLACEHOLDER|GABC') {
        Write-Host "⚠️ Admin public key appears to be a placeholder: $adminPublicKey" -ForegroundColor Yellow
        Write-Host "   Please update with your actual admin public key." -ForegroundColor Yellow
    }
    else {
        # Validate format (simple check)
        if ($adminPublicKey -match '^G[A-Z0-9]{55}$') {
            Write-Host "✅ Admin public key format appears valid" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️ Admin public key format may be invalid: $adminPublicKey" -ForegroundColor Yellow
            Write-Host "   Stellar public keys should start with 'G' and be 56 characters long." -ForegroundColor Yellow
        }
    }
}

Write-Host "`n📋 Auto-Minting Verification Summary:" -ForegroundColor Cyan
if ($missingVars.Count -eq 0 -and $missingApis.Count -eq 0 -and $adminPublicKey -match "^G[A-Z0-9]{55}$") {
    Write-Host "✅ Auto-minting system appears to be properly configured" -ForegroundColor Green
    Write-Host "   Run 'npm run dev' to start the application with auto-minting enabled." -ForegroundColor Green
}
else {
    Write-Host "⚠️ Auto-minting system requires additional configuration" -ForegroundColor Yellow
    Write-Host "   Please address the issues above before running the application." -ForegroundColor Yellow
    Write-Host "   See AUTO_MINTING_CONFIG.md for detailed setup instructions." -ForegroundColor Cyan
}

Write-Host "`nTo test automatic minting, make an investment through the platform UI and check logs for details." -ForegroundColor White
