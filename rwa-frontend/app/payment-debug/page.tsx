'use client';

import { useState } from 'react';
import { StrKey, Asset, Operation } from '@stellar/stellar-sdk';

export default function PaymentDebugPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test: string, result: any, success: boolean) => {
    setTestResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      test,
      result,
      success
    }]);
  };

  const runPaymentTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Address Validation
    addResult('Testing treasury addresses', 'Starting address validation tests...', true);
    
    const testnetTreasury = 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR';
    const mainnetTreasury = 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A';
    
    try {
      const testnetValid = StrKey.isValidEd25519PublicKey(testnetTreasury);
      addResult('Testnet treasury validation', {
        address: testnetTreasury,
        valid: testnetValid,
        length: testnetTreasury.length
      }, testnetValid);

      const mainnetValid = StrKey.isValidEd25519PublicKey(mainnetTreasury);
      addResult('Mainnet treasury validation', {
        address: mainnetTreasury,
        valid: mainnetValid,
        length: mainnetTreasury.length
      }, mainnetValid);

    } catch (error) {
      addResult('Address validation error', error, false);
    }

    // Test 2: Asset Creation
    addResult('Testing asset creation', 'Starting asset creation tests...', true);
    
    try {
      const xlmAsset = Asset.native();
      addResult('XLM asset creation', {
        code: xlmAsset.code,
        isNative: xlmAsset.isNative(),
        issuer: xlmAsset.issuer
      }, true);

      // Test custom asset
      const usdcAsset = new Asset('USDC', 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN');
      addResult('USDC asset creation', {
        code: usdcAsset.code,
        isNative: usdcAsset.isNative(),
        issuer: usdcAsset.issuer
      }, true);

    } catch (error) {
      addResult('Asset creation error', error, false);
    }

    // Test 3: Payment Operation Creation
    addResult('Testing payment operation creation', 'Starting payment operation tests...', true);
    
    try {
      const testAmount = '1.0000000';
      const xlmAsset = Asset.native();
      
      // Test payment operation parameters
      const paymentParams = {
        destination: testnetTreasury,
        asset: xlmAsset,
        amount: testAmount
      };

      addResult('Payment parameters', paymentParams, true);

      // Try to create payment operation
      const paymentOp = Operation.payment(paymentParams);
      addResult('Payment operation creation', {
        type: paymentOp.type,
        destination: paymentOp.destination,
        asset: paymentOp.asset,
        amount: paymentOp.amount
      }, true);

    } catch (error) {
      addResult('Payment operation creation error', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      }, false);
    }

    // Test 4: Edge Cases
    addResult('Testing edge cases', 'Starting edge case tests...', true);
    
    try {
      // Test empty destination
      try {
        Operation.payment({
          destination: '',
          asset: Asset.native(),
          amount: '1.0000000'
        });
        addResult('Empty destination test', 'Should have failed but passed', false);
      } catch (error) {
        addResult('Empty destination test', 'Correctly failed with error', true);
      }

      // Test invalid amount
      try {
        Operation.payment({
          destination: testnetTreasury,
          asset: Asset.native(),
          amount: '0'
        });
        addResult('Zero amount test', 'Should have failed but passed', false);
      } catch (error) {
        addResult('Zero amount test', 'Correctly failed with error', true);
      }

      // Test negative amount
      try {
        Operation.payment({
          destination: testnetTreasury,
          asset: Asset.native(),
          amount: '-1.0000000'
        });
        addResult('Negative amount test', 'Should have failed but passed', false);
      } catch (error) {
        addResult('Negative amount test', 'Correctly failed with error', true);
      }

    } catch (error) {
      addResult('Edge case testing error', error, false);
    }

    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔧 Payment System Debug</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={runPaymentTests}
          disabled={isRunning}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? '🔄 Running Tests...' : '▶️ Run Payment Tests'}
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          🧹 Clear Results
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Test Results</h2>
          
          <div className="space-y-4">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 rounded border-l-4 ${
                  result.success 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{result.test}</h3>
                  <span className={`text-sm px-2 py-1 rounded ${
                    result.success 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-red-200 text-red-800'
                  }`}>
                    {result.success ? '✅ PASS' : '❌ FAIL'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {result.timestamp}
                </div>
                
                <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                  {JSON.stringify(result.result, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h3 className="font-semibold text-blue-800 mb-2">ℹ️ What This Tests</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Treasury address validation using StrKey</li>
          <li>• Asset creation for XLM and custom tokens</li>
          <li>• Payment operation creation with valid parameters</li>
          <li>• Edge cases like empty destinations and invalid amounts</li>
          <li>• Error handling and validation behavior</li>
        </ul>
      </div>
    </div>
  );
}
