'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Calendar,
  DollarSign,
  Building2,
  FileText
} from 'lucide-react';
import { useContractStore } from '@/stores/contract';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { formatTokenAmount, formatCurrency } from '@/lib/stellar';

export default function ContractStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isConnected, address } = useWalletConnection();
  
  const {
    contractId,
    assetMetadata,
    totalSupply,
    isPaused,
    admin,
    userBalance,
    isWhitelisted,
    compliance,
    isLoading,
    error,
    lastUpdated,
    fetchContractData,
    fetchUserData,
    clearError
  } = useContractStore();

  // Fetch contract data on mount
  useEffect(() => {
    fetchContractData();
  }, [fetchContractData]);

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchUserData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    clearError();
    
    try {
      await fetchContractData();
      if (isConnected && address) {
        await fetchUserData(address);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const contractExplorerUrl = `https://stellar.expert/explorer/testnet/contract/${contractId}`;

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              🌾 Smart Contract Status
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time monitoring of the AgroToken Farm Investment smart contract
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleRefresh} 
              disabled={isRefreshing || isLoading}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            
            <Button asChild variant="outline">
              <a href={contractExplorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </a>
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Error:</span>
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contract Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Deployment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Deployment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge variant="default" className="bg-green-500">
                      ✅ Deployed & Initialized
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Network:</span>
                    <Badge variant="secondary">Testnet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paused:</span>
                    <Badge variant={isPaused ? "destructive" : "default"}>
                      {isPaused ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">Contract ID:</div>
                  <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                    {contractId}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Metadata */}
            {assetMetadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Asset Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{assetMetadata.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Symbol:</span>
                      <Badge variant="outline">{assetMetadata.symbol}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <Badge variant="secondary">{assetMetadata.asset_type}</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">Description:</div>
                    <div className="text-sm">{assetMetadata.description}</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Financial Information */}
            {assetMetadata && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Financial Data
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Valuation:</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(formatTokenAmount(assetMetadata.valuation))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Supply:</span>
                      <span className="text-sm font-medium">
                        {formatTokenAmount(totalSupply)} AGRO
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last Updated:</span>
                      <span className="text-xs">
                        {new Date(Number(assetMetadata.last_valuation_date) * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Information */}
            {isConnected && address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-500" />
                    Your Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Balance:</span>
                      <span className="text-sm font-medium">
                        {formatTokenAmount(userBalance)} AGRO
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Whitelisted:</span>
                      <Badge variant={isWhitelisted ? "default" : "secondary"}>
                        {isWhitelisted ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">KYC Status:</span>
                      <Badge variant={compliance?.kyc_verified ? "default" : "secondary"}>
                        {compliance?.kyc_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">Address:</div>
                    <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {address}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Admin Information */}
            {admin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    Admin Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Admin:</span>
                      <Badge variant="outline">Set</Badge>
                    </div>
                    {lastUpdated && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Sync:</span>
                        <span className="text-xs">
                          {new Date(lastUpdated).toLocaleTimeString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground">Admin Address:</div>
                    <div className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {admin}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Loading contract data...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Wallet Connected */}
          {!isConnected && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertCircle className="h-8 w-8 mx-auto text-yellow-500" />
                  <div>
                    <h3 className="font-medium">Wallet Not Connected</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your Freighter wallet to view your account information
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
