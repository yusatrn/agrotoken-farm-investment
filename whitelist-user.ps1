# Whitelist User Address Script
# This script whitelists a user address for token minting

param(
    [Parameter(Mandatory=$true)]
    [string]$UserAddress,
    
    [Parameter(Mandatory=$false)]
    [string]$AdminKeyPair = "alice",
    
    [Parameter(Mandatory=$false)]
    [string]$ContractId = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"
)

Write-Host "Whitelisting User Address" -ForegroundColor Cyan
Write-Host "User Address: $UserAddress" -ForegroundColor Yellow
Write-Host "Contract ID: $ContractId" -ForegroundColor Yellow
Write-Host ""

# Check if Soroban CLI is available
try {
    $sorobanVersion = soroban --version
    Write-Host "Soroban CLI found: $sorobanVersion" -ForegroundColor Green
} catch {
    Write-Host "Soroban CLI not found. Please install Stellar CLI first." -ForegroundColor Red
    exit 1
}

# Validate user address format - Stellar addresses are 56 characters starting with G
if ($UserAddress.Length -ne 56 -or -not $UserAddress.StartsWith("G")) {
    Write-Host "Invalid user address format. Address should start with 'G' and be 56 characters long." -ForegroundColor Red
    Write-Host "Provided address: $UserAddress" -ForegroundColor Yellow
    Write-Host "Provided address length: $($UserAddress.Length)" -ForegroundColor Yellow
    exit 1
}

Write-Host "Checking if user is already whitelisted..." -ForegroundColor Cyan

# Check current whitelist status
try {
    $isWhitelisted = soroban contract invoke `
        --source-account $AdminKeyPair `
        --network testnet `
        --id $ContractId `
        -- is_whitelisted `
        --address $UserAddress
    
    Write-Host "Current whitelist status: $isWhitelisted" -ForegroundColor Yellow
    
    if ($isWhitelisted -eq "true") {
        Write-Host "User is already whitelisted!" -ForegroundColor Green
        exit 0
    }
} catch {
    Write-Host "Could not check whitelist status: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host "Proceeding with whitelisting attempt..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Adding user to whitelist..." -ForegroundColor Cyan

try {
    # Add user to whitelist
    $result = soroban contract invoke `
        --source-account $AdminKeyPair `
        --network testnet `
        --send yes `
        --id $ContractId `
        -- add_to_whitelist `
        --address $UserAddress
    
    Write-Host "Whitelist transaction result: $result" -ForegroundColor Yellow
    
    # Check if the transaction was successful
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully added user to whitelist!" -ForegroundColor Green
        
        # Verify the whitelisting worked
        Write-Host ""
        Write-Host "Verifying whitelist status..." -ForegroundColor Cyan
        
        $verifyStatus = soroban contract invoke `
            --source-account $AdminKeyPair `
            --network testnet `
            --id $ContractId `
            -- is_whitelisted `
            --address $UserAddress
        
        if ($verifyStatus -eq "true") {
            Write-Host "Verification successful! User is now whitelisted." -ForegroundColor Green
            Write-Host ""
            Write-Host "The user can now receive farm tokens automatically on future investments!" -ForegroundColor Green
            Write-Host "For the recent investment, you may need to manually mint tokens or make another small investment to trigger automatic minting." -ForegroundColor Cyan
        } else {
            Write-Host "Verification failed. User may not be properly whitelisted." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Failed to whitelist user. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
    
} catch {
    Write-Host "Error whitelisting user: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Full error details:" -ForegroundColor Red
    Write-Host $_.Exception.ToString() -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- User Address: $UserAddress" -ForegroundColor White
Write-Host "- Whitelist Status: APPROVED" -ForegroundColor Green
Write-Host "- Contract ID: $ContractId" -ForegroundColor White
Write-Host ""
Write-Host "User can now participate in token minting!" -ForegroundColor Green
