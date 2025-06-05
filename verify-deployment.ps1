# AgroToken Contract Verification Script
# This script tests all key contract functions to ensure deployment success

param(
    [string]$KeyName = "alice",
    [string]$Network = "testnet"
)

$CONTRACT_ID = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"

Write-Host "🧪 AgroToken Contract Verification" -ForegroundColor Green
Write-Host "Contract ID: $CONTRACT_ID" -ForegroundColor Cyan
Write-Host "Network: $Network" -ForegroundColor Cyan
Write-Host "Account: $KeyName" -ForegroundColor Cyan

$testResults = @()

# Test 1: Get Metadata
Write-Host "`n1️⃣ Testing get_metadata..." -ForegroundColor Yellow
try {
    $metadata = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_metadata
    Write-Host "✅ Metadata retrieved successfully" -ForegroundColor Green
    $testResults += @{Test="get_metadata"; Status="PASS"; Result=$metadata}
}
catch {
    Write-Host "❌ Failed to get metadata" -ForegroundColor Red
    $testResults += @{Test="get_metadata"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 2: Get Total Supply
Write-Host "`n2️⃣ Testing get_total_supply..." -ForegroundColor Yellow
try {
    $supply = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_total_supply
    Write-Host "✅ Total supply: $supply AGRO" -ForegroundColor Green
    $testResults += @{Test="get_total_supply"; Status="PASS"; Result=$supply}
}
catch {
    Write-Host "❌ Failed to get total supply" -ForegroundColor Red
    $testResults += @{Test="get_total_supply"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 3: Get Admin
Write-Host "`n3️⃣ Testing get_admin..." -ForegroundColor Yellow
try {
    $admin = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_admin
    Write-Host "✅ Admin address: $admin" -ForegroundColor Green
    $testResults += @{Test="get_admin"; Status="PASS"; Result=$admin}
}
catch {
    Write-Host "❌ Failed to get admin" -ForegroundColor Red
    $testResults += @{Test="get_admin"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 4: Check if paused
Write-Host "`n4️⃣ Testing is_paused..." -ForegroundColor Yellow
try {
    $paused = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- is_paused
    Write-Host "✅ Contract paused status: $paused" -ForegroundColor Green
    $testResults += @{Test="is_paused"; Status="PASS"; Result=$paused}
}
catch {
    Write-Host "❌ Failed to check paused status" -ForegroundColor Red
    $testResults += @{Test="is_paused"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 5: Get current timestamp
Write-Host "`n5️⃣ Testing get_current_timestamp..." -ForegroundColor Yellow
try {
    $timestamp = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- get_current_timestamp
    $date = [DateTimeOffset]::FromUnixTimeSeconds($timestamp).ToString()
    Write-Host "✅ Current timestamp: $timestamp ($date)" -ForegroundColor Green
    $testResults += @{Test="get_current_timestamp"; Status="PASS"; Result="$timestamp ($date)"}
}
catch {
    Write-Host "❌ Failed to get timestamp" -ForegroundColor Red
    $testResults += @{Test="get_current_timestamp"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 6: Check balance
Write-Host "`n6️⃣ Testing balance..." -ForegroundColor Yellow
try {
    $userAddress = soroban keys address $KeyName
    $balance = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- balance --address $userAddress
    Write-Host "✅ Balance for $userAddress : $balance AGRO" -ForegroundColor Green
    $testResults += @{Test="balance"; Status="PASS"; Result="$balance AGRO"}
}
catch {
    Write-Host "❌ Failed to get balance" -ForegroundColor Red
    $testResults += @{Test="balance"; Status="FAIL"; Result=$_.Exception.Message}
}

# Test 7: Check whitelist status
Write-Host "`n7️⃣ Testing is_whitelisted..." -ForegroundColor Yellow
try {
    $userAddress = soroban keys address $KeyName
    $whitelisted = soroban contract invoke --id $CONTRACT_ID --source-account $KeyName --network $Network -- is_whitelisted --address $userAddress
    Write-Host "✅ Whitelist status for $userAddress : $whitelisted" -ForegroundColor Green
    $testResults += @{Test="is_whitelisted"; Status="PASS"; Result=$whitelisted}
}
catch {
    Write-Host "❌ Failed to check whitelist status" -ForegroundColor Red
    $testResults += @{Test="is_whitelisted"; Status="FAIL"; Result=$_.Exception.Message}
}

# Summary
Write-Host "`n📊 Test Summary" -ForegroundColor Blue
Write-Host "=" * 50 -ForegroundColor Blue

$passedTests = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$totalTests = $testResults.Count
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host "Total Tests: $totalTests" -ForegroundColor White
Write-Host "Passed: $passedTests" -ForegroundColor Green
Write-Host "Failed: $($totalTests - $passedTests)" -ForegroundColor Red
Write-Host "Success Rate: $successRate%" -ForegroundColor Cyan

Write-Host "`n📋 Detailed Results:" -ForegroundColor Blue
foreach ($result in $testResults) {
    $status = if ($result.Status -eq "PASS") { "✅" } else { "❌" }
    Write-Host "$status $($result.Test): $($result.Status)" -ForegroundColor White
}

if ($passedTests -eq $totalTests) {
    Write-Host "`n🎉 ALL TESTS PASSED! Contract is fully operational." -ForegroundColor Green
    Write-Host "✅ Ready for frontend integration and user testing" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Please review the results above." -ForegroundColor Yellow
}

Write-Host "`n🔗 Contract Explorer:" -ForegroundColor Blue
Write-Host "https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID" -ForegroundColor Cyan

Write-Host "`nVerification completed at $(Get-Date)" -ForegroundColor Gray
