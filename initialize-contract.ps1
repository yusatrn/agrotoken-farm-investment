# Initialize AgroToken Farm Investment Contract
# This script initializes the deployed contract with metadata and admin settings

param(
    [string]$KeyName = "alice",
    [string]$Network = "testnet"
)

Write-Host "🌾 Initializing AgroToken Farm Investment Contract" -ForegroundColor Green
Write-Host "Key Name: $KeyName" -ForegroundColor Yellow
Write-Host "Network: $Network" -ForegroundColor Yellow

# Contract ID from deployment
$CONTRACT_ID = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"

# Get admin address
try {
    $adminAddress = soroban keys address $KeyName
    Write-Host "Admin Address: $adminAddress" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Failed to get admin address for key: $KeyName" -ForegroundColor Red
    exit 1
}

# Initialize contract with AgroToken metadata
Write-Host "`n🚀 Initializing contract..." -ForegroundColor Blue
try {
    $result = soroban contract invoke `
        --id $CONTRACT_ID `
        --source-account $KeyName `
        --network $Network `
        --send=yes `
        -- initialize `
        --admin $adminAddress `
        --asset_metadata '{
            "name": "AgroToken Farm Investment",
            "symbol": "AGRO",
            "description": "Agricultural asset tokenization platform enabling fractional ownership of farm investments",
            "asset_type": "agricultural",
            "legal_doc_hash": "QmYwAPJzv5CZsnA4qWkc2bGhJ2mGmbkVr8sxCTBCPLGSoL",
            "valuation": 10000000000,
            "last_valuation_date": 1749149666
        }' `
        --initial_supply 1000000000

    Write-Host "✅ Contract initialized successfully!" -ForegroundColor Green
    Write-Host "Result: $result" -ForegroundColor Cyan
}
catch {
    Write-Host "❌ Failed to initialize contract" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Test contract functionality
Write-Host "`n🧪 Testing contract functions..." -ForegroundColor Blue

# Test get_metadata
try {
    Write-Host "Testing get_metadata..." -ForegroundColor Yellow
    $metadata = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_metadata
    Write-Host "✅ Metadata: $metadata" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Could not get metadata" -ForegroundColor Yellow
}

# Test get_admin
try {
    Write-Host "Testing get_admin..." -ForegroundColor Yellow
    $admin = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_admin
    Write-Host "✅ Admin: $admin" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Could not get admin" -ForegroundColor Yellow
}

# Test get_total_supply
try {
    Write-Host "Testing get_total_supply..." -ForegroundColor Yellow
    $supply = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_total_supply
    Write-Host "✅ Total Supply: $supply" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Could not get total supply" -ForegroundColor Yellow
}

# Test is_paused
try {
    Write-Host "Testing is_paused..." -ForegroundColor Yellow
    $paused = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- is_paused
    Write-Host "✅ Is Paused: $paused" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Could not get paused status" -ForegroundColor Yellow
}

Write-Host "`n🎉 Contract initialization completed!" -ForegroundColor Green
Write-Host "`n📋 Contract Details:" -ForegroundColor Blue
Write-Host "Contract ID: $CONTRACT_ID" -ForegroundColor Cyan
Write-Host "Admin: $adminAddress" -ForegroundColor Cyan
Write-Host "Network: $Network" -ForegroundColor Cyan
Write-Host "Explorer: https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID" -ForegroundColor Cyan

Write-Host "`n✅ Ready for frontend integration!" -ForegroundColor Green
