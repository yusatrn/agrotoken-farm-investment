# Script to check the status of a Stellar Soroban transaction
param(
    [Parameter(Mandatory=$true)]
    [string]$TransactionHash
)

Write-Host "Checking transaction status for: $TransactionHash" -ForegroundColor Cyan

# Try to use Node.js first for detailed information
try {
    $nodeScript = @"
const { SorobanRpc } = require('@stellar/stellar-sdk');
const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

async function checkTransaction() {
  try {
    const txHash = '$TransactionHash';
    console.log('🔍 Checking transaction status:', txHash);
    
    const response = await server.getTransaction(txHash);
    console.log('📊 Transaction status:', response.status);
    
    if (response.status === 'SUCCESS') {
      console.log('✅ Transaction confirmed successfully!');
      if (response.returnValue) {
        console.log('📋 Result:', JSON.stringify(response.returnValue, null, 2));
      }
    } else if (response.status === 'FAILED') {
      console.log('❌ Transaction failed:', response.resultXdr || response.resultMetaXdr);
    } else {
      console.log('⏳ Transaction still processing...');
    }
  } catch (error) {
    if (error.message && error.message.includes('404')) {
      console.log('⏳ Transaction not yet found in ledger (still processing)');
    } else {
      console.log('❌ Error checking transaction:', error.message || error);
    }
  }
}

checkTransaction();
"@

    # Save to a temporary file
    $tempFile = [System.IO.Path]::GetTempFileName() + ".js"
    Set-Content -Path $tempFile -Value $nodeScript

    # Run with Node.js
    Write-Host "Running Node.js check..." -ForegroundColor Yellow
    node $tempFile

    # Clean up
    Remove-Item -Path $tempFile
} catch {
    Write-Host "Failed to check with Node.js: $_" -ForegroundColor Red
    
    # Fallback to soroban CLI
    Write-Host "Falling back to soroban CLI..." -ForegroundColor Yellow
    try {
        $result = soroban transaction status --network testnet --id $TransactionHash --output json | ConvertFrom-Json
        
        if ($result) {
            Write-Host "Transaction Status: $($result.status)" -ForegroundColor Green
            if ($result.status -eq "SUCCESS") {
                Write-Host "✅ Transaction successful!" -ForegroundColor Green
            }
            elseif ($result.status -eq "NOT_FOUND") {
                Write-Host "⏳ Transaction still processing..." -ForegroundColor Yellow
            }
            else {
                Write-Host "❓ Status: $($result.status)" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host "Failed to check with soroban CLI: $_" -ForegroundColor Red
        Write-Host "You can manually check the transaction at: https://stellar.expert/explorer/testnet/tx/$TransactionHash" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "View transaction in Explorer: https://stellar.expert/explorer/testnet/tx/$TransactionHash" -ForegroundColor Cyan
