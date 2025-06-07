# Test Automatic Token Minting
# This script tests the automatic token minting API endpoints

param(
    [Parameter(Mandatory=$false)]
    [string]$BaseUrl = "http://localhost:3000",
    
    [Parameter(Mandatory=$false)]
    [string]$TestAddress = "GTEST...USER_ADDRESS",
    
    [Parameter(Mandatory=$false)]
    [string]$Amount = "100.00"
)

Write-Host "🧪 Testing Automatic Token Minting API Endpoints" -ForegroundColor Cyan

# Check if server is running first
try {
    Invoke-WebRequest -Uri $BaseUrl -Method HEAD -TimeoutSec 5 | Out-Null
    Write-Host "✅ Server is running at $BaseUrl" -ForegroundColor Green
} catch {
    Write-Host "❌ Server is not running at $BaseUrl" -ForegroundColor Red
    Write-Host "   Start the server with 'npm run dev' before running this test" -ForegroundColor Yellow
    exit 1
}

# Test 1: API Mint-Tokens Endpoint
Write-Host "`n📌 Test 1: Direct Minting API" -ForegroundColor Cyan

try {
    $body = @{
        destinationAddress = $TestAddress
        amount = $Amount
        source = "test-script"
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/mint-tokens" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "✅ Direct minting API responded successfully" -ForegroundColor Green
        Write-Host "   Transaction Hash: $($result.transactionHash)" -ForegroundColor Green
        $txHash = $result.transactionHash
    } else {
        Write-Host "⚠️ Direct minting API returned an error: $($result.error)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing direct minting API: $_" -ForegroundColor Red
}

# Test 2: Check Transaction Status
if ($txHash) {
    Write-Host "`n📌 Test 2: Transaction Status API" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/check-transaction?hash=$txHash" -Method GET -UseBasicParsing
        $result = $response.Content | ConvertFrom-Json
        
        Write-Host "✅ Transaction status API responded successfully" -ForegroundColor Green
        Write-Host "   Transaction Status: $($result.status)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error checking transaction status: $_" -ForegroundColor Red
    }
}

# Test 3: Queue Minting API
Write-Host "`n📌 Test 3: Queue Minting API" -ForegroundColor Cyan

try {
    $body = @{
        address = $TestAddress
        amount = $Amount
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/queue-mint" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    if ($result.success) {
        Write-Host "✅ Queue minting API responded successfully" -ForegroundColor Green
        Write-Host "   Queue ID: $($result.queueId)" -ForegroundColor Green
        $queueId = $result.queueId
    } else {
        Write-Host "⚠️ Queue minting API returned an error: $($result.error)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error testing queue minting API: $_" -ForegroundColor Red
}

# Test 4: Check Queue Status
if ($queueId) {
    Write-Host "`n📌 Test 4: Queue Status API" -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/queue-mint?queueId=$queueId" -Method GET -UseBasicParsing
        $result = $response.Content | ConvertFrom-Json
        
        Write-Host "✅ Queue status API responded successfully" -ForegroundColor Green
        Write-Host "   Queue Item Status: $($result.status)" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error checking queue status: $_" -ForegroundColor Red
    }
}

# Test 5: Admin Check API
Write-Host "`n📌 Test 5: Admin Check API" -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/api/check-admin?address=$TestAddress" -Method GET -UseBasicParsing
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Admin check API responded successfully" -ForegroundColor Green
    Write-Host "   Is Admin: $($result.isAdmin)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error checking admin status: $_" -ForegroundColor Red
}

Write-Host "`n🎉 Auto-Minting API Tests Complete!" -ForegroundColor Cyan
