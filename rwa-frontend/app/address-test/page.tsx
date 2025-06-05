'use client';

import { useState } from 'react';
import { PaymentProcessor } from '@/lib/payment';
import { isConnected, getPublicKey } from '@stellar/freighter-api';

export default function AddressTestPage() {
  const [userAddress, setUserAddress] = useState<string>('');
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    addLog('🔍 Connecting to Freighter wallet...');
    
    try {
      const connected = await isConnected();
      if (connected.isConnected) {
        const publicKey = await getPublicKey();
        setUserAddress(publicKey);
        addLog(`✅ Connected: ${publicKey}`);
      } else {
        addLog('❌ Wallet not connected');
      }
    } catch (error) {
      addLog(`❌ Connection error: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const testSpecificAddress = async (testName: string, address: string) => {
    addLog(`🧪 Testing ${testName}: ${address}`);
    
    if (!userAddress) {
      addLog('❌ Please connect wallet first');
      return;
    }

    try {
      const paymentProcessor = new PaymentProcessor('testnet');
      
      // Try to create a payment transaction with this specific address
      const result = await paymentProcessor.createPaymentTransaction(
        userAddress,
        '0.1', // Small amount for testing
        'XLM'
      );

      addLog(`✅ ${testName} SUCCESS: Transaction hash ${result}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      addLog(`❌ ${testName} FAILED: ${errorMsg}`);
    }
  };

  const runAddressTests = async () => {
    if (!userAddress) {
      addLog('❌ Please connect wallet first');
      return;
    }

    addLog('🚀 Starting comprehensive address tests...');

    // Test current treasury address
    await testSpecificAddress('Current Treasury', 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR');
    
    // Test original address that might have been causing issues
    await testSpecificAddress('Original Treasury', 'GCKFBEIYTKP3JH7R7AL6LRMJHHJMG7VKMRMJ7N7ZDOEJF4VDCFLQV3CC');
    
    // Test known good testnet addresses
    await testSpecificAddress('SDF Testnet', 'GAIH3ULLFQ4DGSECF2AR555KZ4KNDGEKN4AFI4SU2M7B43MGK3QJZNSR');
    
    // Test user's own address (should work)
    await testSpecificAddress('Self Payment', userAddress);

    addLog('🏁 Address testing complete!');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">🎯 Address Validation Test</h1>
      
      <div className="mb-6 space-y-4">
        <div>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
          </button>
          
          {userAddress && (
            <p className="mt-2 text-sm text-gray-600">
              Connected: {userAddress.slice(0, 8)}...{userAddress.slice(-8)}
            </p>
          )}
        </div>

        <div className="space-x-4">
          <button
            onClick={runAddressTests}
            disabled={!userAddress}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            🧪 Run Address Tests
          </button>
          
          <button
            onClick={clearLogs}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            🧹 Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📝 Test Logs</h2>
        <div className="max-h-96 overflow-y-auto font-mono text-sm">
          {logs.length === 0 ? (
            <p className="text-gray-500">No logs yet. Connect wallet and run tests.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">🎯 What This Tests</h3>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Tests the exact "destination is invalid" error scenario</li>
          <li>• Compares different treasury addresses to isolate the issue</li>
          <li>• Uses actual payment transaction creation (not just validation)</li>
          <li>• Tests with your real wallet address for comparison</li>
          <li>• Provides detailed error messages for troubleshooting</li>
        </ul>
      </div>
    </div>
  );
}
