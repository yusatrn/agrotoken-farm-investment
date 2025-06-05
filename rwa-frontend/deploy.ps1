# Deployment script for AgroToken Farm Investment Platform (PowerShell)

Write-Host "🌾 AgroToken Farm Investment Platform - Deployment Script" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the rwa-frontend directory" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Run linting
Write-Host "🔍 Running linting..." -ForegroundColor Yellow
npm run lint

# Run type checking and build
Write-Host "🏗️  Building for production..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready for deployment!" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor White
    Write-Host "1. Push your code to GitHub" -ForegroundColor White
    Write-Host "2. Connect to Vercel/Netlify/Railway" -ForegroundColor White
    Write-Host "3. Set environment variables:" -ForegroundColor White
    Write-Host "   - NEXT_PUBLIC_STELLAR_NETWORK=testnet (or mainnet)" -ForegroundColor Gray
    Write-Host "   - NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org" -ForegroundColor Gray
    Write-Host "   - NEXT_PUBLIC_APP_NAME=AgroToken Farm Investment" -ForegroundColor Gray
    Write-Host ""
    Write-Host "For Vercel quick deploy:" -ForegroundColor White
    Write-Host "npm i -g vercel; vercel" -ForegroundColor Gray
} else {
    Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
    exit 1
}
