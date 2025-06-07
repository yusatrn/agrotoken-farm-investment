'use client';

import { useState, useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { ComplianceData } from '@/lib/types';
import { checkComplianceStatus, getComplianceRequirements, ComplianceStatus } from '@/lib/compliance';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Info,
  Wallet
} from 'lucide-react';
import { formatTokenAmount, isValidStellarAddress, toContractAmount, estimateNetworkFee } from '@/lib/stellar';
import { toast } from 'sonner';
import Link from 'next/link';

export default function TransferPage() {
  const { isConnected, address, connect } = useWalletStore();
  const { 
    userBalance, 
    isWhitelisted, 
    compliance,
    transfer,
    isLoading,
    fetchUserData,
    fetchContractData
  } = useContractStore();  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isValidRecipient, setIsValidRecipient] = useState(false);
  const [recipientCompliance, setRecipientCompliance] = useState<ComplianceData | null>(null);
  const [senderComplianceStatus, setSenderComplianceStatus] = useState<ComplianceStatus | null>(null);
  const [recipientComplianceStatus, setRecipientComplianceStatus] = useState<ComplianceStatus | null>(null);
  // Load data on mount and when wallet connects
  useEffect(() => {
    fetchContractData();
    if (isConnected && address) {
      fetchUserData(address);
      // Check sender compliance status
      checkComplianceStatus(address).then(setSenderComplianceStatus);
    }
  }, [isConnected, address, fetchContractData, fetchUserData]);
  // Validate recipient address and check compliance
  useEffect(() => {
    if (recipient) {
      const valid = isValidStellarAddress(recipient);
      setIsValidRecipient(valid);
      
      if (valid) {
        // Check recipient compliance status
        checkComplianceStatus(recipient).then(setRecipientComplianceStatus);
        
        // In a real app, this would check recipient compliance
        setRecipientCompliance({
          kyc_verified: true,
          accredited_investor: false,
          jurisdiction: 'US',
          compliance_expiry: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60)
        });
      } else {
        setRecipientCompliance(null);
        setRecipientComplianceStatus(null);
      }
    } else {
      setIsValidRecipient(false);
      setRecipientCompliance(null);
      setRecipientComplianceStatus(null);
    }
  }, [recipient]);

  const handleMaxAmount = () => {
    setAmount(formatTokenAmount(userBalance));
  };
  const canTransfer = () => {
    if (!isConnected || !address) return false;
    if (!senderComplianceStatus?.isCompliant) return false;
    if (!isValidRecipient) return false;
    if (!recipientComplianceStatus?.isCompliant) return false;
    if (!amount || parseFloat(amount) <= 0) return false;
    if (parseFloat(amount) > parseFloat(formatTokenAmount(userBalance))) return false;
    return true;
  };
  const handleTransfer = async () => {
    if (!canTransfer() || !address) return;

    try {
      // Additional validation before transfer
      const currentBalance = userBalance ? formatTokenAmount(userBalance) : '0';
      const transferAmount = parseFloat(amount);
      const availableBalance = parseFloat(currentBalance);

      console.log('Transfer validation:', {
        transferAmount,
        availableBalance,
        userBalance,
        contractAmount: toContractAmount(amount)
      });

      if (availableBalance === 0) {
        toast.error('You have no tokens to transfer. Please acquire tokens first.');
        return;
      }

      if (transferAmount > availableBalance) {
        toast.error(`Insufficient balance. You have ${currentBalance} AGRO but trying to transfer ${amount} AGRO.`);
        return;
      }

      const contractAmount = toContractAmount(amount);
      console.log('Executing transfer with contract amount:', contractAmount);
      
      const success = await transfer(address, recipient, contractAmount);
      
      if (success) {
        toast.success('Transfer completed successfully!');
        setAmount('');
        setRecipient('');
      } else {
        toast.error('Transfer failed. Please try again.');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      
      // Provide more specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('Insufficient balance')) {
        toast.error('Transfer failed: Insufficient balance in your account.');      } else if (errorMessage.includes('UnreachableCodeReached')) {
        toast.error('Transfer failed: Contract execution error. This may be due to compliance requirements.');
      } else if (errorMessage.includes('KYC verification')) {
        toast.error('Transfer failed: KYC verification required for both sender and recipient.');
      } else if (errorMessage.includes('compliance has expired')) {
        toast.error('Transfer failed: Compliance verification has expired. Please renew your KYC.');
      } else if (errorMessage.includes('not whitelisted')) {
        toast.error('Transfer failed: Address not authorized for transfers.');
      } else if (errorMessage.includes('User declined')) {
        toast.error('Transfer cancelled by user.');
      } else {
        toast.error(`Transfer failed: ${errorMessage}`);
      }
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-6">
            <Card className="w-full max-w-md text-center">
              <CardHeader>
                <Wallet className="h-16 w-16 mx-auto text-muted-foreground" />
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>
                  You need to connect your Freighter wallet to transfer RWA tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={connect} className="w-full">
                  Connect Freighter Wallet
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">🚀 Farm Share Transfer</h1>
            <p className="text-muted-foreground">
              Send your agricultural investment shares to other verified farm investors
            </p>
          </div>          {/* Compliance Status */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>
                    Your certification status: {' '}
                    <Badge variant={senderComplianceStatus?.isCompliant ? 'default' : 'destructive'}>
                      {senderComplianceStatus?.isCompliant ? 'Fully Compliant' : 'Compliance Required'}
                    </Badge>
                  </span>
                  {compliance?.kyc_verified && (
                    <Badge variant="outline" className="text-xs">
                      KYC Verified
                    </Badge>
                  )}
                </div>
                {senderComplianceStatus && !senderComplianceStatus.isCompliant && (
                  <div className="text-sm space-y-1">
                    {senderComplianceStatus.issues.map((issue, index) => (
                      <div key={index} className="text-yellow-600">⚠️ {issue}</div>
                    ))}
                    {senderComplianceStatus.recommendations.map((rec, index) => (
                      <div key={index} className="text-blue-600">💡 {rec}</div>
                    ))}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>

          {/* Current Holdings */}
          <Card>
            <CardHeader>
              <CardTitle>🌾 Your Farm Holdings</CardTitle>
              <CardDescription>Available farm shares for transfer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{formatTokenAmount(userBalance)} LAPT</p>
                  <p className="text-sm text-muted-foreground">Green Valley Organic Farm shares</p>
                </div>
                <Badge variant="secondary">🌽 Cropland</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Transfer Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Transfer Farm Shares
              </CardTitle>
              <CardDescription>
                Enter the new farm investor address and share amount
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipient Address */}
              <div className="space-y-2">
                <Label htmlFor="recipient">New Farm Investor Address</Label>
                <Input
                  id="recipient"
                  placeholder="G... (Stellar address)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className={`font-mono ${
                    recipient && !isValidRecipient ? 'border-red-500' : ''
                  }`}
                />
                {recipient && !isValidRecipient && (
                  <p className="text-sm text-red-600">Invalid Stellar address format</p>
                )}                {isValidRecipient && recipientComplianceStatus && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    <div className="flex items-center gap-2">
                      {recipientComplianceStatus.isCompliant ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                      )}
                      <span>
                        Recipient Status: {' '}
                        <Badge variant={recipientComplianceStatus.isCompliant ? 'default' : 'secondary'}>
                          {recipientComplianceStatus.isCompliant ? 'Compliant' : 'Issues Found'}
                        </Badge>
                      </span>
                    </div>
                    {!recipientComplianceStatus.isCompliant && (
                      <div className="mt-1 space-y-1">
                        {recipientComplianceStatus.issues.map((issue, index) => (
                          <div key={index} className="text-yellow-600 text-xs">⚠️ {issue}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Amount */}              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount (AGRO)</Label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleMaxAmount}
                    className="text-xs"
                  >
                    Max: {formatTokenAmount(userBalance)}
                  </Button>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
                {amount && parseFloat(amount) > parseFloat(formatTokenAmount(userBalance)) && (
                  <p className="text-sm text-red-600">Insufficient balance</p>
                )}
              </div>

              {/* Transaction Details */}
              {amount && isValidRecipient && (
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium">Transaction Summary</h4>
                  <div className="space-y-2 text-sm">                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-mono">{amount} AGRO</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Network Fee:</span>
                      <span className="font-mono">{estimateNetworkFee('transfer')} XLM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>To:</span>
                      <span className="font-mono text-xs">
                        {recipient.slice(0, 8)}...{recipient.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer Button */}
              <Button 
                onClick={handleTransfer}
                disabled={!canTransfer() || isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  'Processing Transfer...'
                ) : (
                  <>
                    Transfer Tokens
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>              {/* Warnings */}
              {!senderComplianceStatus?.isCompliant && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div>You cannot transfer tokens due to compliance issues:</div>
                      {senderComplianceStatus?.issues.map((issue, index) => (
                        <div key={index} className="text-sm">• {issue}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              {recipientComplianceStatus && !recipientComplianceStatus.isCompliant && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <div>Recipient cannot receive tokens due to compliance issues:</div>
                      {recipientComplianceStatus.issues.map((issue, index) => (
                        <div key={index} className="text-sm">• {issue}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transfer Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">KYC Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Both sender and recipient must have completed KYC verification
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Whitelist Status</p>
                  <p className="text-sm text-muted-foreground">
                    Addresses must be on the approved whitelist for this asset
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Jurisdiction Compliance</p>
                  <p className="text-sm text-muted-foreground">
                    Transfers must comply with local regulations and asset restrictions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/">
                ← Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
} 