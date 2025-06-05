'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PaymentProcessor, { INVESTMENT_PACKAGES } from '@/lib/payment';

export default function SimpleInvestTestPage() {
  const { address, isConnected, connect } = useWalletStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [paymentProcessor] = useState(() => new PaymentProcessor('testnet'));

  const testInvestment = async () => {
    if (!address) {
      alert('Please connect wallet first');
      return;
    }

    setIsProcessing(true);
    setLastResult(null);

    try {
      console.log('🧪 Testing investment with basic parameters...');
      
      const result = await paymentProcessor.processInvestmentPayment(
        address,
        'organic-farm-basic', // Fixed package
        '10', // 10 XLM
        'XLM' // Fixed currency
      );

      console.log('🧪 Test result:', result);
      setLastResult(result);

      if (result.success) {
        alert(`✅ Test Investment Successful!\n\nTransaction: ${result.transactionHash}\nFarm Tokens: ${result.farmTokens}\n\n${result.note || ''}`);
      } else {
        alert('❌ Test Investment Failed');
      }
    } catch (error) {
      console.error('🧪 Test error:', error);
      setLastResult({ error: error instanceof Error ? error.message : String(error) });
      alert('❌ Test Error: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Simple Investment Test
          </h1>
          <p className="text-gray-600">
            Test the basic investment functionality with fixed parameters
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Wallet Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  ✅ Connected
                </Badge>
                <div className="text-sm text-gray-600">
                  Address: <code className="bg-gray-100 px-2 py-1 rounded">{address?.substring(0, 16)}...</code>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Badge variant="destructive">❌ Not Connected</Badge>
                <Button onClick={connect} className="w-full">
                  Connect Freighter Wallet
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Package:</strong><br />
                <code>organic-farm-basic</code>
              </div>
              <div>
                <strong>Amount:</strong><br />
                <code>10 XLM</code>
              </div>
              <div>
                <strong>Currency:</strong><br />
                <code>XLM (Native)</code>
              </div>
              <div>
                <strong>Expected Tokens:</strong><br />
                <code>10 GVOF</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Run Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testInvestment}
              disabled={!isConnected || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isProcessing ? (
                '🔄 Processing Test Investment...'
              ) : (
                '🚀 Run Investment Test'
              )}
            </Button>
          </CardContent>
        </Card>

        {lastResult && (
          <Card>
            <CardHeader>
              <CardTitle>Last Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Status:</strong>{' '}
                  <Badge variant={lastResult.success ? 'secondary' : 'destructive'}>
                    {lastResult.success ? '✅ Success' : '❌ Failed'}
                  </Badge>
                </div>
                
                {lastResult.transactionHash && (
                  <div className="text-sm">
                    <strong>Transaction Hash:</strong><br />
                    <code className="bg-gray-100 px-2 py-1 rounded break-all">
                      {lastResult.transactionHash}
                    </code>
                  </div>
                )}
                
                {lastResult.farmTokens && (
                  <div className="text-sm">
                    <strong>Farm Tokens Received:</strong> {lastResult.farmTokens} GVOF
                  </div>
                )}
                
                {lastResult.note && (
                  <div className="text-sm">
                    <strong>Note:</strong><br />
                    <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-yellow-800">
                      {lastResult.note}
                    </div>
                  </div>
                )}
                
                {lastResult.error && (
                  <div className="text-sm">
                    <strong>Error:</strong><br />
                    <div className="bg-red-50 border border-red-200 p-2 rounded text-red-800">
                      {lastResult.error}
                    </div>
                  </div>
                )}
                
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    Raw Result Data
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                    {JSON.stringify(lastResult, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">
            This test uses the Organic Farm Basic package with 10 XLM investment.
            <br />
            Check the browser console for detailed logs during testing.
          </div>
        </div>
      </div>
    </div>
  );
}
