'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/stores/wallet';
import { useContractStore } from '@/stores/contract';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Coins, 
  TrendingUp, 
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { formatTokenAmount, formatCurrency, formatPercentage } from '@/lib/stellar';
import Link from 'next/link';

export default function Dashboard() {
  const { isConnected, address, checkConnection } = useWalletStore();
  const { 
    assetMetadata, 
    userBalance, 
    isWhitelisted, 
    compliance,
    isLoading,
    fetchContractData,
    fetchUserData 
  } = useContractStore();

  // Check wallet connection and fetch data on mount
  useEffect(() => {
    checkConnection();
    fetchContractData();
  }, [checkConnection, fetchContractData]);

  // Fetch user data when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      fetchUserData(address);
    }
  }, [isConnected, address, fetchUserData]);
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] space-y-8">
            <div className="text-center space-y-4 max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight">
                🌾 AgroToken Farm Investment Platform
              </h1>
              <p className="text-xl text-muted-foreground">
                Sustainable agriculture investment platform powered by blockchain technology. 
                Support farmers and earn returns from agricultural assets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
              <Card className="text-center">
                <CardHeader>
                  <div className="text-4xl mb-2">🚜</div>
                  <CardTitle className="text-lg">Farm Assets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Invest in agricultural lands, livestock farms, and food production facilities
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
                  <CardTitle className="text-lg">Sustainable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Support organic farming and sustainable agriculture practices
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 mx-auto text-blue-600" />
                  <CardTitle className="text-lg">Farm Returns</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Earn passive income through harvest yields and farm appreciation
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">          {/* Welcome Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">🌾 Welcome to AgroToken Farm Investment</h1>
            <p className="text-lg text-muted-foreground">
              Your gateway to sustainable agriculture investments
            </p>
          </div>

          {/* Portfolio Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Farm Portfolio Value</CardTitle>
                <div className="text-xl">🚜</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTokenAmount(userBalance)} LAPT
                </div>
                <p className="text-xs text-muted-foreground">
                  ≈ {formatCurrency(
                    (parseFloat(formatTokenAmount(userBalance)) * 1000).toString()
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Organic Certification Status</CardTitle>
                {isWhitelisted ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isWhitelisted ? 'Verified' : 'Pending'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {compliance?.kyc_verified ? 'KYC Complete' : 'KYC Required'}
                </p>
              </CardContent>
            </Card>            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Est. Annual Yield</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-muted-foreground">
                  Harvest returns + appreciation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Harvest</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45 days</div>
                <p className="text-xs text-muted-foreground">
                  Corn & soybean season
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Current Asset */}
          {assetMetadata && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{assetMetadata.name}</CardTitle>
                    <CardDescription className="text-base">
                      {assetMetadata.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {assetMetadata.asset_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Current Valuation</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(formatTokenAmount(assetMetadata.valuation, 7))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Your Share</p>
                    <p className="text-2xl font-bold">
                      {((parseFloat(formatTokenAmount(userBalance)) / 2500) * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Token Symbol</p>
                    <p className="text-2xl font-bold font-mono">{assetMetadata.symbol}</p>
                  </div>
                </div>
                  <div className="flex gap-3">
                  <Button asChild>
                    <Link href="/transfer">
                      🚀 Share Transfer
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/marketplace">
                      🔍 Explore Farms
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🌾 Farm Investment Opportunities</CardTitle>
                <CardDescription>
                  Discover new agricultural assets to diversify your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">🌽 Organic Corn Farm</p>
                      <p className="text-sm text-muted-foreground">Cropland - Iowa</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">15.2% APY</p>
                      <Badge variant="outline" className="text-xs">Available</Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">🐄 Dairy Farm Operations</p>
                      <p className="text-sm text-muted-foreground">Livestock - Wisconsin</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">11.8% APY</p>
                      <Badge variant="outline" className="text-xs">Q3 2025</Badge>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/marketplace">
                    🔍 View All Farm Opportunities
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Recent Activity</CardTitle>
                <CardDescription>
                  Your latest farming investments and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">🌾 Welcome to AgroToken</p>
                      <p className="text-xs text-muted-foreground">Farm investment account created</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">✅ Organic Certification</p>
                      <p className="text-xs text-muted-foreground">Verification status updated</p>
                    </div>
                    <p className="text-xs text-muted-foreground">2 min ago</p>
                  </div>
                </div>
                  <Button className="w-full" variant="outline" asChild>
                  <Link href="/tokenize">
                    🚀 List Your Farm
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
