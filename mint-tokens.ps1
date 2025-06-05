# Simple Token Minting Script
param(
    [Parameter(Mandatory=$true)]
    [string]$UserAddress,
    
    [Parameter(Mandatory=$true)]
    [string]$TokenAmount,
    
    [Parameter(Mandatory=$false)]
    [string]$TransactionHash = ""
)

$AdminKeyPair = "alice"
$ContractId = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"

if ($TransactionHash) {
    Write-Host "Minting $TokenAmount tokens to $UserAddress for transaction $TransactionHash..." -ForegroundColor Cyan
} else {
    Write-Host "Minting $TokenAmount tokens to $UserAddress..." -ForegroundColor Cyan
}

# Check if user is whitelisted
$isWhitelisted = soroban contract invoke --source-account $AdminKeyPair --network testnet --id $ContractId -- is_whitelisted --address $UserAddress

if ($isWhitelisted -ne "true") {
    Write-Host "Error: User is not whitelisted!" -ForegroundColor Red
    exit 1
}

Write-Host "User is whitelisted. Proceeding with minting..." -ForegroundColor Green

# Get current balance
$currentBalance = soroban contract invoke --source-account $AdminKeyPair --network testnet --id $ContractId -- balance --address $UserAddress
Write-Host "Current balance: $currentBalance tokens" -ForegroundColor Yellow

# Mint tokens
Write-Host "Minting tokens..." -ForegroundColor Cyan
soroban contract invoke --source-account $AdminKeyPair --network testnet --send yes --id $ContractId -- mint_simple --to $UserAddress --amount $TokenAmount

if ($LASTEXITCODE -eq 0) {
    Write-Host "Minting successful!" -ForegroundColor Green
    
    # Check new balance
    Start-Sleep -Seconds 2
    $newBalance = soroban contract invoke --source-account $AdminKeyPair --network testnet --id $ContractId -- balance --address $UserAddress
    Write-Host "New balance: $newBalance tokens" -ForegroundColor Green
      $increase = [decimal]$newBalance.Trim('"') - [decimal]$currentBalance.Trim('"')
    Write-Host "Tokens minted: +$increase" -ForegroundColor Green
} else {
    Write-Host "Minting failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Token minting completed successfully!" -ForegroundColor Green
