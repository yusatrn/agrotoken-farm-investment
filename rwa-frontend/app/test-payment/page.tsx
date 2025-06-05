'use client';

import { useState } from 'react';
import { isConnected, getPublicKey, signTransaction } from '@stellar/freighter-api';
import { PaymentProcessor } from '@/lib/payment';

export default function TestPaymentPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    addLog('🔍 Checking Freighter wallet...');
    
    try {
      const connected = await isConnected();
      addLog(`Freighter connected: ${connected.isConnected}`);
      
      if (connected.isConnected) {
        const publicKey = await getPublicKey();
        setWalletAddress(publicKey);
        addLog(`✅ Wallet connected: ${publicKey}`);
      } else {
        addLog('❌ Wallet not connected');
      }
    } catch (error) {
      addLog(`❌ Error checking wallet: ${error}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const testPayment = async () => {
    if (!walletAddress) {
      addLog('❌ Please connect wallet first');
      return;
    }

    setIsProcessing(true);
    addLog('🚀 Starting test payment...');

    try {
      const paymentProcessor = new PaymentProcessor('testnet');
      
      const result = await paymentProcessor.processInvestmentPayment(
        walletAddress,
        'organic-farm-basic',
        '1', // 1 XLM
        'XLM'
      );

      if (result.success) {
        addLog(`✅ Payment successful! Hash: ${result.transactionHash}`);
        addLog(`🎉 Farm tokens received: ${result.farmTokens}`);
      } else {
        addLog('❌ Payment failed');
      }
    } catch (error) {
      addLog(`❌ Payment error: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Payment System Test</h1>
      
      <div className="space-y-4 mb-8">
        <div>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Freighter Wallet'}
          </button>
          
          {walletAddress && (
            <p className="mt-2 text-sm text-gray-600">
              Connected: {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </p>
          )}
        </div>

        <div>
          <button
            onClick={testPayment}
            disabled={isProcessing || !walletAddress}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Test Payment (1 XLM)'}
          </button>
        </div>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Debug Logs</h2>
        <div className="max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="text-sm font-mono mb-1">
              {log}
            </div>
          ))}
        </div>
        {logs.length > 0 && (
          <button
            onClick={() => setLogs([])}
            className="mt-2 text-xs bg-gray-300 px-2 py-1 rounded"
          >
            Clear Logs
          </button>
        )}
      </div>
    </div>
  );
}
