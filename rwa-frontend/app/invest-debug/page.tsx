'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Loader2,
  Wallet,
  CreditCard
} from 'lucide-react';
import PaymentProcessor, { INVESTMENT_PACKAGES, PAYMENT_CURRENCIES } from '@/lib/payment';
import { isConnected } from '@stellar/freighter-api';

export default function InvestDebugPage() {
  const { address, isConnected: storeConnected, connect } = useWalletStore();
  const [debugSteps, setDebugSteps] = useState<Array<{
    step: string;
    status: 'pending' | 'success' | 'error' | 'running';
    message?: string;
    details?: any;
  }>>([]);
  const [selectedPackage] = useState('organic-farm-basic');
  const [investmentAmount] = useState('10');
  const [selectedCurrency] = useState('XLM');
  const [paymentProcessor] = useState(() => new PaymentProcessor('testnet'));

  const addDebugStep = (step: string, status: 'pending' | 'success' | 'error' | 'running', message?: string, details?: any) => {
    setDebugSteps(prev => [...prev, { step, status, message, details }]);
  };

  const updateLastStep = (status: 'success' | 'error', message?: string, details?: any) => {
    setDebugSteps(prev => {
      const updated = [...prev];
      if (updated.length > 0) {
        updated[updated.length - 1] = { ...updated[updated.length - 1], status, message, details };
      }
      return updated;
    });
  };

  const clearSteps = () => {
    setDebugSteps([]);
  };

  const testWalletConnection = async () => {
    addDebugStep('Wallet Connection', 'running', 'Checking wallet connection...');
    
    try {
      // Check store state
      console.log('Store connected:', storeConnected);
      console.log('Store address:', address);
      
      // Check Freighter directly
      const freighterResult = await isConnected();
      console.log('Freighter result:', freighterResult);
      
      if (!freighterResult.isConnected) {
        updateLastStep('error', 'Freighter wallet not connected', {
          storeConnected,
          address,
          freighterResult
        });
        return false;
      }
      
      if (!address) {
        updateLastStep('error', 'No wallet address in store', {
          storeConnected,
          address,
          freighterResult
        });
        return false;
      }
      
      updateLastStep('success', `Wallet connected: ${address.substring(0, 8)}...`, {
        storeConnected,
        address,
        freighterResult
      });
      return true;
      
    } catch (error) {
      updateLastStep('error', `Wallet connection error: ${error instanceof Error ? error.message : String(error)}`, error);
      return false;
    }
  };

  const testFormValidation = async () => {
    addDebugStep('Form Validation', 'running', 'Validating investment form...');
    
    try {
      const pkg = INVESTMENT_PACKAGES.find(p => p.id === selectedPackage);
      if (!pkg) {
        updateLastStep('error', 'Investment package not found');
        return false;
      }
      
      const minInvestment = pkg.minimumInvestment[selectedCurrency];
      const userAmount = parseFloat(investmentAmount);
      const minAmount = parseFloat(minInvestment);
      
      if (userAmount < minAmount) {
        updateLastStep('error', `Amount ${investmentAmount} < minimum ${minInvestment}`, {
          userAmount,
          minAmount,
          minInvestment
        });
        return false;
      }
      
      updateLastStep('success', 'Form validation passed', {
        package: pkg.name,
        amount: investmentAmount,
        currency: selectedCurrency,
        minimum: minInvestment
      });
      return true;
      
    } catch (error) {
      updateLastStep('error', `Validation error: ${error instanceof Error ? error.message : String(error)}`, error);
      return false;
    }
  };

  const testPaymentProcessing = async () => {
    addDebugStep('Payment Processing', 'running', 'Testing payment processing...');
    
    try {
      if (!address) {
        updateLastStep('error', 'No wallet address available');
        return false;
      }
      
      console.log('Starting payment processing test...');
      
      const result = await paymentProcessor.processInvestmentPayment(
        address,
        selectedPackage,
        investmentAmount,
        selectedCurrency
      );
      
      console.log('Payment result:', result);
      
      if (result.success) {
        updateLastStep('success', `Payment successful! ${result.note || ''}`, {
          transactionHash: result.transactionHash,
          farmTokens: result.farmTokens,
          note: result.note
        });
        return true;
      } else {
        updateLastStep('error', 'Payment failed', result);
        return false;
      }
      
    } catch (error) {
      updateLastStep('error', `Payment error: ${error instanceof Error ? error.message : String(error)}`, error);
      return false;
    }
  };

  const runFullTest = async () => {
    clearSteps();
    
    const walletOk = await testWalletConnection();
    if (!walletOk) return;
    
    const validationOk = await testFormValidation();
    if (!validationOk) return;
    
    await testPaymentProcessing();
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connect error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔍 Investment Debug Tool
            </h1>
            <p className="text-xl text-gray-600">
              Test and debug the investment flow step by step
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Test Controls */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Test Controls
                  </CardTitle>
                  <CardDescription>
                    Run individual tests or full investment flow
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!storeConnected ? (
                    <Button onClick={handleConnect} className="w-full">
                      <Wallet className="mr-2 h-4 w-4" />
                      Connect Wallet First
                    </Button>
                  ) : (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Wallet connected: {address?.substring(0, 8)}...
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={testWalletConnection} 
                      variant="outline" 
                      className="w-full"
                    >
                      Test Wallet Connection
                    </Button>
                    <Button 
                      onClick={testFormValidation} 
                      variant="outline" 
                      className="w-full"
                    >
                      Test Form Validation
                    </Button>
                    <Button 
                      onClick={testPaymentProcessing} 
                      variant="outline" 
                      className="w-full"
                      disabled={!storeConnected}
                    >
                      Test Payment Processing
                    </Button>
                  </div>
                  
                  <Button 
                    onClick={runFullTest} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={!storeConnected}
                  >
                    Run Full Investment Test
                  </Button>
                  
                  <Button 
                    onClick={clearSteps} 
                    variant="ghost" 
                    className="w-full"
                  >
                    Clear Results
                  </Button>
                </CardContent>
              </Card>

              {/* Test Parameters */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Test Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div><strong>Package:</strong> {selectedPackage}</div>
                    <div><strong>Amount:</strong> {investmentAmount} {selectedCurrency}</div>
                    <div><strong>Currency:</strong> {selectedCurrency}</div>
                    <div><strong>Network:</strong> Testnet</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Debug Results */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Debug Results</CardTitle>
                  <CardDescription>
                    Step-by-step test results and error details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {debugSteps.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No tests run yet. Click a test button to start.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {debugSteps.map((step, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(step.status)}
                            <span className="font-semibold">{step.step}</span>
                          </div>
                          
                          {step.message && (
                            <div className="text-sm text-gray-600 mb-2">
                              {step.message}
                            </div>
                          )}
                          
                          {step.details && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                                Show Details
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
                                {JSON.stringify(step.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
