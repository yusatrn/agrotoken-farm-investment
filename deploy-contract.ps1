# Stellar Soroban Contract Deployment Script
# Run this script after installing Rust and Soroban CLI

param(
    [string]$KeyName = "alice",
    [string]$Network = "testnet"
)

Write-Host "🚀 Starting Stellar Soroban Contract Deployment" -ForegroundColor Green
Write-Host "Key Name: $KeyName" -ForegroundColor Yellow
Write-Host "Network: $Network" -ForegroundColor Yellow

# Function to check if command exists
function Test-Command($cmdname) {
    try {
        if (Get-Command $cmdname -ErrorAction SilentlyContinue) {
            return $true
        }
    }
    catch {
        return $false
    }
    return $false
}

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Blue

if (-not (Test-Command "cargo")) {
    Write-Host "❌ Rust/Cargo not found. Please install Rust first:" -ForegroundColor Red
    Write-Host "   https://rustup.rs/" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Rust/Cargo found" -ForegroundColor Green

if (-not (Test-Command "soroban")) {
    Write-Host "❌ Soroban CLI not found. Installing..." -ForegroundColor Red
    try {
        cargo install --locked soroban-cli
        Write-Host "✅ Soroban CLI installed" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install Soroban CLI" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ Soroban CLI found" -ForegroundColor Green
}

# Add WASM target
Write-Host "`n🎯 Adding WASM target..." -ForegroundColor Blue
try {
    rustup target add wasm32-unknown-unknown
    Write-Host "✅ WASM target added" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  WASM target might already be installed" -ForegroundColor Yellow
}

# Generate keypair if it doesn't exist
Write-Host "`n🔑 Setting up keypair..." -ForegroundColor Blue
try {
    $existingKey = soroban keys address $KeyName 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Key '$KeyName' already exists: $existingKey" -ForegroundColor Green
    }
    else {
        soroban keys generate $KeyName
        $newKey = soroban keys address $KeyName
        Write-Host "✅ Generated new key '$KeyName': $newKey" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Failed to generate/check keypair" -ForegroundColor Red
    exit 1
}

# Configure network
Write-Host "`n🌐 Configuring network..." -ForegroundColor Blue
try {
    if ($Network -eq "testnet") {
        soroban network add testnet --rpc-url https://soroban-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
    }
    elseif ($Network -eq "mainnet") {
        soroban network add mainnet --rpc-url https://soroban-mainnet.stellar.org:443 --network-passphrase "Public Global Stellar Network ; September 2015"
    }
    
    soroban network use $Network
    Write-Host "✅ Network '$Network' configured and selected" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Network might already be configured" -ForegroundColor Yellow
}

# Fund account (testnet only)
if ($Network -eq "testnet") {
    Write-Host "`n💰 Funding testnet account..." -ForegroundColor Blue
    try {
        soroban keys fund $KeyName --network testnet
        Write-Host "✅ Account funded with testnet XLM" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Account funding might have failed or account already has funds" -ForegroundColor Yellow
    }
}

# Build contract
Write-Host "`n🔨 Building contract..." -ForegroundColor Blue
try {
    cargo build --target wasm32-unknown-unknown --release
    Write-Host "✅ Contract built successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to build contract" -ForegroundColor Red
    exit 1
}

# Deploy contract
Write-Host "`n🚀 Deploying contract..." -ForegroundColor Blue
try {
    $contractId = soroban contract deploy --wasm target/wasm32-unknown-unknown/release/agrotoken_farm_investment.wasm --source $KeyName --network $Network
    Write-Host "✅ Contract deployed successfully!" -ForegroundColor Green
    Write-Host "📋 CONTRACT ID: $contractId" -ForegroundColor Cyan
    Write-Host "📋 Save this Contract ID for your frontend!" -ForegroundColor Yellow
    
    # Save to file
    $contractId | Out-File -FilePath "CONTRACT_ID.txt" -Encoding UTF8
    Write-Host "✅ Contract ID saved to CONTRACT_ID.txt" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to deploy contract" -ForegroundColor Red
    exit 1
}

# Show account info
Write-Host "`n📊 Account Information:" -ForegroundColor Blue
try {
    $publicKey = soroban keys address $KeyName
    $secretKey = soroban keys show $KeyName
    Write-Host "Public Key: $publicKey" -ForegroundColor Cyan
    Write-Host "Secret Key: $secretKey" -ForegroundColor Cyan
    Write-Host "⚠️  IMPORTANT: Keep your secret key safe and never share it!" -ForegroundColor Red
}
catch {
    Write-Host "⚠️  Could not retrieve account information" -ForegroundColor Yellow
}

# Frontend integration instructions
Write-Host "`n🖥️  Frontend Integration:" -ForegroundColor Blue
Write-Host "1. Update rwa-frontend/lib/stellar.ts:" -ForegroundColor White
Write-Host "   export const RWA_CONTRACT_ID = '$contractId';" -ForegroundColor Cyan
Write-Host "2. Verify network setting in stellar.ts:" -ForegroundColor White
Write-Host "   export const DEFAULT_NETWORK = '$Network';" -ForegroundColor Cyan
Write-Host "3. Test in Stellar Explorer:" -ForegroundColor White
if ($Network -eq "testnet") {
    Write-Host "   https://stellar.expert/explorer/testnet/contract/$contractId" -ForegroundColor Cyan
}
else {
    Write-Host "   https://stellar.expert/explorer/public/contract/$contractId" -ForegroundColor Cyan
}

Write-Host "`n🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "Contract ID: $contractId" -ForegroundColor Cyan
