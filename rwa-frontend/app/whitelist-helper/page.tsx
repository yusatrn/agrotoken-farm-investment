'use client';

import { useState } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, CheckCircle, Wallet, Users, Coins } from 'lucide-react';

export default function WhitelistHelperPage() {
  const { address, isConnected, connect } = useWalletStore();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyWhitelistCommand = async () => {
    if (address) {
      const command = `.\\whitelist-user.ps1 -UserAddress ${address}`;
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyMintCommand = async () => {
    if (address) {
      const command = `.\\mint-tokens.ps1 -UserAddress ${address} -TokenAmount 10`;
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Whitelist Helper Tool
          </h1>
          <p className="text-gray-600">
            Complete your investment by whitelisting your address for automatic token minting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Wallet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Wallet Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    ✅ Connected
                  </Badge>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Your Address:</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">
                        {address}
                      </code>
                      <Button onClick={copyAddress} size="sm" variant="outline">
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your payment was successful! Now you need to be whitelisted to receive farm tokens.
                    </AlertDescription>
                  </Alert>
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

          {/* Whitelisting Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Whitelisting Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    To complete your investment and receive farm tokens, run this command in PowerShell:
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Whitelist Command:</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 bg-blue-50 px-3 py-2 rounded text-sm font-mono break-all border">
                        .\\whitelist-user.ps1 -UserAddress {address}
                      </code>
                      <Button onClick={copyWhitelistCommand} size="sm" variant="outline">
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="text-sm text-yellow-800">
                      <strong>Steps:</strong>
                      <ol className="mt-2 list-decimal list-inside space-y-1">
                        <li>Open PowerShell in the project folder</li>
                        <li>Copy and run the whitelist command above</li>
                        <li>Run the mint command below (optional - for your recent investment)</li>
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Connect your wallet first to see whitelisting instructions.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Minting */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Manual Token Minting
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isConnected ? (
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    After whitelisting, mint tokens for your recent investment:
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Mint Command (10 tokens):</label>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="flex-1 bg-green-50 px-3 py-2 rounded text-sm font-mono break-all border">
                        .\\mint-tokens.ps1 -UserAddress {address} -TokenAmount 10
                      </code>
                      <Button onClick={copyMintCommand} size="sm" variant="outline">
                        {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <Coins className="h-4 w-4" />
                    <AlertDescription>
                      This will mint 10 GVOF tokens to your wallet for your recent 10 XLM investment.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Connect your wallet first to see minting instructions.
                </div>
              )}
            </CardContent>
          </Card>

          {/* What Happens Next */}
          <Card>
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-xs">1</div>
                  <div>
                    <strong>Run Whitelist Command:</strong> This adds your address to the approved list for receiving tokens.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-xs">2</div>
                  <div>
                    <strong>Run Mint Command:</strong> This manually mints tokens for your recent investment.
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-xs">3</div>
                  <div>
                    <strong>Future Investments:</strong> Once whitelisted, all future investments will automatically mint tokens to your wallet!
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">
            Need help? The PowerShell scripts are located in the project root directory.
            <br />
            Make sure you're running PowerShell as Administrator if you encounter permission issues.
          </div>
        </div>
      </div>
    </div>
  );
}
