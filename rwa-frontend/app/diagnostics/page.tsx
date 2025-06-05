'use client';

import { useState, useEffect } from 'react';
import { StrKey } from '@stellar/stellar-sdk';
import { PaymentProcessor, PAYMENT_CURRENCIES } from '@/lib/payment';

export default function DiagnosticsPage() {
  const [results, setResults] = useState<{ [key: string]: any }>({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const diagnostics: { [key: string]: any } = {};

    try {
      // Test 1: Payment Processor Initialization
      diagnostics.paymentProcessor = {
        testnet: 'Testing PaymentProcessor initialization for testnet...',
        result: 'success'
      };
      
      try {
        const processor = new PaymentProcessor('testnet');
        diagnostics.paymentProcessor.instance = 'Created successfully';
      } catch (error) {
        diagnostics.paymentProcessor.error = error instanceof Error ? error.message : String(error);
        diagnostics.paymentProcessor.result = 'failed';
      }

      // Test 2: Treasury Address Validation
      diagnostics.treasuryAddress = {
        testing: 'Validating treasury addresses...',
        result: 'success'
      };

      const testnetTreasury = 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR';
      const mainnetTreasury = 'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A';

      diagnostics.treasuryAddress.testnet = {
        address: testnetTreasury,
        valid: StrKey.isValidEd25519PublicKey(testnetTreasury),
        length: testnetTreasury.length
      };

      diagnostics.treasuryAddress.mainnet = {
        address: mainnetTreasury,
        valid: StrKey.isValidEd25519PublicKey(mainnetTreasury),
        length: mainnetTreasury.length
      };

      // Test 3: Payment Currencies
      diagnostics.currencies = {
        testing: 'Checking payment currencies configuration...',
        currencies: PAYMENT_CURRENCIES,
        count: PAYMENT_CURRENCIES.length,
        result: 'success'
      };

      // Test 4: Stellar SDK Operations
      diagnostics.stellarSDK = {
        testing: 'Testing Stellar SDK imports and basic operations...',
        result: 'success'
      };

      try {
        const { Asset, Operation } = await import('@stellar/stellar-sdk');
        diagnostics.stellarSDK.Asset = 'Imported successfully';
        diagnostics.stellarSDK.Operation = 'Imported successfully';

        // Test creating a basic asset
        const xlm = Asset.native();
        diagnostics.stellarSDK.nativeAsset = {
          code: xlm.code,
          isNative: xlm.isNative()
        };

        // Test creating a payment operation structure (without executing)
        const testOperation = {
          destination: testnetTreasury,
          asset: xlm,
          amount: '1.0000000'
        };
        diagnostics.stellarSDK.testOperation = testOperation;

      } catch (error) {
        diagnostics.stellarSDK.error = error instanceof Error ? error.message : String(error);
        diagnostics.stellarSDK.result = 'failed';
      }

      // Test 5: Freighter API
      diagnostics.freighter = {
        testing: 'Testing Freighter API availability...',
        result: 'success'
      };

      try {
        const { isConnected } = await import('@stellar/freighter-api');
        diagnostics.freighter.imported = 'Successfully imported';
        
        // Test if Freighter is available
        const connected = await isConnected();
        diagnostics.freighter.available = connected;
      } catch (error) {
        diagnostics.freighter.error = error instanceof Error ? error.message : String(error);
        diagnostics.freighter.result = 'failed';
      }

    } catch (generalError) {
      diagnostics.general = {
        error: generalError instanceof Error ? generalError.message : String(generalError),
        result: 'failed'
      };
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const renderResult = (key: string, value: any, depth = 0) => {
    const indent = '  '.repeat(depth);
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className={`mb-2 ${depth === 0 ? 'border-b pb-2' : ''}`}>
          <strong className={depth === 0 ? 'text-lg' : ''}>{key}:</strong>
          <div className="ml-4">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderResult(subKey, subValue, depth + 1)
            )}
          </div>
        </div>
      );
    }

    const colorClass = 
      value === 'success' ? 'text-green-600' :
      value === 'failed' ? 'text-red-600' :
      value === true ? 'text-green-600' :
      value === false ? 'text-red-600' :
      'text-gray-800';

    return (
      <div key={key} className="mb-1">
        <span className="font-medium">{indent}{key}:</span>{' '}
        <span className={colorClass}>{String(value)}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🔬 AgroToken System Diagnostics</h1>
      
      <div className="mb-6">
        <button
          onClick={runDiagnostics}
          disabled={isRunning}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isRunning ? '🔄 Running Diagnostics...' : '▶️ Run Diagnostics'}
        </button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📊 Diagnostic Results</h2>
          <div className="font-mono text-sm">
            {Object.entries(results).map(([key, value]) => 
              renderResult(key, value)
            )}
          </div>
        </div>
      )}

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 Troubleshooting Tips</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• If treasury address validation fails, check the address format and length</li>
          <li>• If Freighter shows as unavailable, make sure the browser extension is installed</li>
          <li>• If Stellar SDK operations fail, check for import or network issues</li>
          <li>• Payment failures often relate to insufficient XLM balance or invalid addresses</li>        </ul>
      </div>
    </div>
  );
}
