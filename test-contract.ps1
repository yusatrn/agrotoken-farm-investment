# Contract Testing Script
# Run this after deploying your contract

param(
    [Parameter(Mandatory=$true)]
    [string]$ContractId,
    [string]$KeyName = "alice",
    [string]$Network = "testnet"
)

Write-Host "🧪 Testing Stellar Soroban Contract" -ForegroundColor Green
Write-Host "Contract ID: $ContractId" -ForegroundColor Yellow
Write-Host "Network: $Network" -ForegroundColor Yellow

# Test read functions
Write-Host "`n📊 Testing read functions..." -ForegroundColor Blue

try {
    Write-Host "Testing total_supply..." -ForegroundColor White
    $totalSupply = soroban contract invoke --id $ContractId --source $KeyName --network $Network -- total_supply
    Write-Host "✅ Total Supply: $totalSupply" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to get total supply" -ForegroundColor Red
}

try {
    Write-Host "Testing get_asset_metadata..." -ForegroundColor White
    $metadata = soroban contract invoke --id $ContractId --source $KeyName --network $Network -- get_asset_metadata
    Write-Host "✅ Asset Metadata: $metadata" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to get asset metadata" -ForegroundColor Red
}

try {
    Write-Host "Testing is_paused..." -ForegroundColor White
    $isPaused = soroban contract invoke --id $ContractId --source $KeyName --network $Network -- is_paused
    Write-Host "✅ Is Paused: $isPaused" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to check pause status" -ForegroundColor Red
}

# Test balance function
try {
    $userAddress = soroban keys address $KeyName
    Write-Host "Testing balance for $userAddress..." -ForegroundColor White
    $balance = soroban contract invoke --id $ContractId --source $KeyName --network $Network -- balance --address $userAddress
    Write-Host "✅ Balance: $balance" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to get balance" -ForegroundColor Red
}

# Test whitelist check
try {
    $userAddress = soroban keys address $KeyName
    Write-Host "Testing whitelist status for $userAddress..." -ForegroundColor White
    $isWhitelisted = soroban contract invoke --id $ContractId --source $KeyName --network $Network -- is_whitelisted --address $userAddress
    Write-Host "✅ Is Whitelisted: $isWhitelisted" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to check whitelist status" -ForegroundColor Red
}

Write-Host "`n🌐 Explorer Links:" -ForegroundColor Blue
if ($Network -eq "testnet") {
    Write-Host "Contract: https://stellar.expert/explorer/testnet/contract/$ContractId" -ForegroundColor Cyan
    $userAddress = soroban keys address $KeyName
    Write-Host "Account: https://stellar.expert/explorer/testnet/account/$userAddress" -ForegroundColor Cyan
}
else {
    Write-Host "Contract: https://stellar.expert/explorer/public/contract/$ContractId" -ForegroundColor Cyan
    $userAddress = soroban keys address $KeyName
    Write-Host "Account: https://stellar.expert/explorer/public/account/$userAddress" -ForegroundColor Cyan
}

Write-Host "`n✅ Contract testing completed!" -ForegroundColor Green
