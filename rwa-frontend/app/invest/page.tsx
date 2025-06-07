'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Coins, 
  TrendingUp, 
  Shield, 
  Info,
  CheckCircle,
  ArrowRight,
  Wallet,
  AlertTriangle
} from 'lucide-react';
import PaymentProcessor, { INVESTMENT_PACKAGES, PAYMENT_CURRENCIES, formatCurrencyAmount } from '@/lib/payment';

export default function InvestmentPage() {
  const { address, isConnected, connect } = useWalletStore();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USDC');
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProcessor] = useState(() => new PaymentProcessor('testnet'));
  const [portfolioValue, setPortfolioValue] = useState<any>(null);
  
  // New state variables for better user feedback
  const [successMessage, setSuccessMessage] = useState<{
    title: string;
    message: string;
    details: { label: string; value: string }[];
    note: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<{
    hash: string;
    status: 'pending' | 'completed' | 'failed';
    lastChecked: string;
  } | null>(null);
  // Load user portfolio on mount
  useEffect(() => {
    if (address) {
      loadPortfolio();
    }
  }, [address]);
  
  // Function to poll for transaction status
  const startTransactionStatusPolling = (txHash: string) => {
    let attempts = 0;
    const maxAttempts = 10;
    
    const pollInterval = setInterval(async () => {
      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        return;
      }
      
      attempts++;
      
      try {
        // This would call an API endpoint that checks transaction status
        const response = await fetch(`/api/check-transaction?hash=${txHash}`);
        if (response.ok) {
          const data = await response.json();
          
          setTransactionStatus(prev => ({
            ...prev!,
            status: data.status === 'SUCCESS' ? 'completed' : 
                   data.status === 'FAILED' ? 'failed' : 'pending',
            lastChecked: new Date().toISOString()
          }));
          
          // If transaction is complete, stop polling and refresh portfolio
          if (data.status === 'SUCCESS') {
            clearInterval(pollInterval);
            loadPortfolio();
          }
          
          // If transaction failed, stop polling
          if (data.status === 'FAILED') {
            clearInterval(pollInterval);
          }
        }
      } catch (error) {
        console.error('Error polling transaction status:', error);
      }
    }, 10000); // Check every 10 seconds
    
    // Store the interval ID for cleanup
    return () => clearInterval(pollInterval);
  };

  const loadPortfolio = async () => {
    if (!address) return;
    
    try {
      const portfolio = await paymentProcessor.getPortfolioValue(address);
      setPortfolioValue(portfolio);
    } catch (error) {
      console.error('Failed to load portfolio:', error);
    }
  };  const handleInvestment = async () => {
    if (!isConnected || !address || !selectedPackage || !investmentAmount) {
      const missing = [];
      if (!isConnected) missing.push('wallet connection');
      if (!address) missing.push('wallet address');
      if (!selectedPackage) missing.push('investment package');
      if (!investmentAmount) missing.push('investment amount');
      
      const message = `Please complete the following: ${missing.join(', ')}`;
      alert(message);
      return;
    }

    // Validate minimum investment
    const selectedPackageData = INVESTMENT_PACKAGES.find(p => p.id === selectedPackage);
    if (selectedPackageData) {
      const minInvestment = selectedPackageData.minimumInvestment[selectedCurrency];
      const userAmount = parseFloat(investmentAmount);
      const minAmount = parseFloat(minInvestment);
      
      if (userAmount < minAmount) {
        const message = `Minimum investment is ${minInvestment} ${selectedCurrency}. You entered ${investmentAmount} ${selectedCurrency}.`;
        alert(message);
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const result = await paymentProcessor.processInvestmentPayment(
        address,
        selectedPackage,
        investmentAmount,
        selectedCurrency
      );      if (result.success) {
        // Use state to show proper success message instead of alert
        setSuccessMessage({
          title: 'Investment Successful!',
          message: `You have successfully invested ${investmentAmount} ${selectedCurrency}.`,
          details: [
            { label: 'Farm Tokens', value: `${result.farmTokens} ${selectedPackageData?.farmTokenSymbol || ''}` },
            { label: 'Transaction Hash', value: result.transactionHash || 'Processing' },
          ],
          note: result.note || ''
        });
        
        // Check for transaction hash to monitor token minting
        if (result.transactionHash) {
          setTransactionStatus({
            hash: result.transactionHash,
            status: 'pending',
            lastChecked: new Date().toISOString()
          });
          
          // Start polling for transaction status if tokens are being minted asynchronously
          if (result.note?.includes('will be delivered shortly') || 
              result.note?.includes('in progress') || 
              result.note?.includes('minted by an administrator')) {
            startTransactionStatusPolling(result.transactionHash);
          }
        }
        
        await loadPortfolio(); // Refresh portfolio
        setInvestmentAmount('');
      } else {
        console.error('❌ Investment failed:', result);
        setErrorMessage('Investment failed. Please try again.');
      }
    } catch (error) {
      console.error('💥 Investment error:', error);
      alert('Investment failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Connect error:', error);
      alert('Failed to connect wallet: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const selectedPackageData = INVESTMENT_PACKAGES.find(p => p.id === selectedPackage);
  const selectedCurrencyData = PAYMENT_CURRENCIES.find(c => c.code === selectedCurrency);
  const minInvestment = selectedPackageData?.minimumInvestment[selectedCurrency];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🌱 Farm Investment Platform
            </h1>
            <p className="text-xl text-gray-600">
              Invest in real agricultural assets with blockchain technology
            </p>
          </div>

          {/* Current Portfolio */}
          {portfolioValue && (
            <Card className="mb-8 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-green-600" />
                  Your Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${parseFloat(portfolioValue.totalValue).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {portfolioValue.holdings.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Investments</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      +0.00%
                    </div>
                    <div className="text-sm text-gray-600">Total Return</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Investment Packages */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Investment Packages</h2>
              
              <div className="space-y-4">
                {INVESTMENT_PACKAGES.map((pkg) => (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      selectedPackage === pkg.id 
                        ? 'ring-2 ring-green-500 bg-green-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{pkg.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {pkg.description}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            pkg.riskLevel === 'Low' ? 'secondary' :
                            pkg.riskLevel === 'Medium' ? 'default' : 'destructive'
                          }>
                            {pkg.riskLevel} Risk
                          </Badge>
                          <div className="text-sm text-gray-600 mt-1">
                            {pkg.duration} days
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">
                            {pkg.expectedReturn}% APY
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Farm Token: <span className="font-mono">{pkg.farmTokenSymbol}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-gray-600">
                        <strong>Minimum Investment:</strong>                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {Object.entries(pkg.minimumInvestment).map(([currency, amount]) => (
                            <div key={currency} className="text-center p-2 bg-gray-50 rounded">
                              {formatCurrencyAmount(amount, currency, false)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Investment Form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Make Investment</h2>
              
              {!isConnected ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Connect your Freighter wallet to start investing
                    </p>
                    <Button onClick={handleConnect}>Connect Wallet</Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Investment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Package Selection Status */}
                    {selectedPackageData && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Selected: <strong>{selectedPackageData.name}</strong>
                          <br />
                          Expected Return: <strong>{selectedPackageData.expectedReturn}% APY</strong>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Payment Currency */}
                    <div>
                      <Label htmlFor="currency">Payment Currency</Label>
                      <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center gap-2">
                                <span>{currency.logo}</span>
                                <span>{currency.name} ({currency.code})</span>
                                {currency.isStableCoin && (
                                  <Badge variant="secondary" className="text-xs">Stable</Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Investment Amount */}
                    <div>
                      <Label htmlFor="amount">Investment Amount</Label>
                      <div className="mt-1 relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          {selectedCurrency}
                        </div>
                      </div>
                        {minInvestment && (
                        <p className="text-sm text-gray-600 mt-1">
                          Minimum: {formatCurrencyAmount(minInvestment, selectedCurrency, false)}
                        </p>
                      )}
                    </div>

                    {/* Investment Preview */}
                    {selectedPackageData && investmentAmount && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Investment Preview</h4>
                        <div className="space-y-1 text-sm">                          <div className="flex justify-between">
                            <span>Investment Amount:</span>
                            <span>{formatCurrencyAmount(investmentAmount, selectedCurrency, false)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Farm Tokens to Receive:</span>
                            <span className="font-mono">{investmentAmount} {selectedPackageData.farmTokenSymbol}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Annual Return:</span>
                            <span className="text-green-600 font-semibold">{selectedPackageData.expectedReturn}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Notice */}
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Secure Investment:</strong> Your investment is protected by Stellar blockchain 
                        technology and smart contracts. All transactions are transparent and verifiable.
                      </AlertDescription>
                    </Alert>                    {/* Validation Feedback */}
                    {(!selectedPackage || !investmentAmount) && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                          {!selectedPackage && !investmentAmount 
                            ? 'Please select an investment package and enter an amount to proceed.'
                            : !selectedPackage 
                            ? 'Please select an investment package from the left.'
                            : 'Please enter an investment amount.'}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {/* Error Message */}
                    {errorMessage && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          {errorMessage}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Invest Button */}
                    <Button
                      onClick={handleInvestment}
                      disabled={!selectedPackage || !investmentAmount || isProcessing}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isProcessing ? (
                        'Processing Investment...'
                      ) : (
                        <>
                          Invest Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>          {/* Success Message Dialog */}
          {successMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="max-w-lg w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {successMessage.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{successMessage.message}</p>
                  
                  {successMessage.details.length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      {successMessage.details.map((detail, idx) => (
                        <div key={idx} className="flex justify-between mb-2 last:mb-0">
                          <span className="text-gray-600">{detail.label}:</span>
                          <span className="font-mono font-medium">{detail.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {transactionStatus && (
                    <div className="border border-gray-200 rounded-md p-4 mb-4">
                      <h4 className="font-medium mb-2">Transaction Status</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${
                          transactionStatus.status === 'completed' ? 'text-green-600' :
                          transactionStatus.status === 'failed' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>
                          {transactionStatus.status.charAt(0).toUpperCase() + transactionStatus.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Transaction Hash:</span>
                        <span className="font-mono text-sm overflow-hidden text-ellipsis">{transactionStatus.hash.substring(0, 10)}...</span>
                      </div>
                    </div>
                  )}
                  
                  {successMessage.note && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        {successMessage.note}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={() => {
                      setSuccessMessage(null);
                      // Don't reset transaction status - it should continue updating
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 mt-4"
                  >
                    Close
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="text-center py-6">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure & Transparent</h3>
                <p className="text-sm text-gray-600">
                  All investments are secured by blockchain technology and smart contracts
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center py-6">
                <Coins className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Multiple Currencies</h3>
                <p className="text-sm text-gray-600">
                  Invest with XLM, USDC, USDT or other supported cryptocurrencies
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="text-center py-6">
                <TrendingUp className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Real Farm Assets</h3>
                <p className="text-sm text-gray-600">
                  Invest in tokenized real-world agricultural assets with verified returns
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
