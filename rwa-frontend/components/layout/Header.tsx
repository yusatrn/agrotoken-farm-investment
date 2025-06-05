'use client';

import Link from 'next/link';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Wallet, 
  Network, 
  LogOut,
  ExternalLink,
  Copy,
  ChevronDown,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getExplorerUrl } from '@/lib/stellar';
import { toast } from 'sonner';

export function Header() {
  const {
    isConnected,
    address,
    network,
    isLoading,
    connect,
    disconnect,
    getDisplayAddress,
    getDisplayBalance,
    getNetworkDisplay
  } = useWalletConnection();

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleNetworkSwitch = async (newNetwork: 'testnet' | 'mainnet') => {
    if (newNetwork === network) return;
    
    const targetNetwork = newNetwork === 'mainnet' ? 'Mainnet (PUBLIC)' : 'Testnet';
    toast.error(
      `Please switch to ${targetNetwork} in your Freighter wallet settings, then reconnect.`,
      {
        duration: 6000,
      }
    );
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openInExplorer = () => {
    if (address) {
      window.open(getExplorerUrl(address, 'account', network), '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold">AgroToken</h1>
              <p className="text-xs text-muted-foreground">Farm Investment Platform</p>
            </div>
          </Link>          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Farm Dashboard
            </Link>
            <Link 
              href="/invest" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              💰 Invest Now
            </Link>
            <Link 
              href="/marketplace" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Agricultural Marketplace
            </Link>
            <Link 
              href="/tokenize" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              List Your Farm
            </Link>
            <Link 
              href="/transfer" 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Share Transfer
            </Link>            <Link 
              href="/debug" 
              className="text-xs font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              Debug
            </Link>            <Link 
              href="/diagnostics" 
              className="text-xs font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              🔬 Diagnostics
            </Link>            <Link 
              href="/payment-debug" 
              className="text-xs font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              🔧 Payment Debug
            </Link>
            <Link 
              href="/address-test" 
              className="text-xs font-mono text-muted-foreground transition-colors hover:text-primary"
            >
              🎯 Address Test
            </Link>
          </nav>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-3">
          {/* Network Selector */}
          {isConnected && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 cursor-pointer">
                  <Network className="h-4 w-4" />
                  <Badge variant={network === 'testnet' ? 'secondary' : 'default'}>
                    {getNetworkDisplay()}
                  </Badge>
                  <ChevronDown className="h-3 w-3" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleNetworkSwitch('testnet')}
                  className={network === 'testnet' ? 'bg-muted' : ''}
                >
                  <Network className="h-4 w-4 mr-2" />
                  Testnet
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleNetworkSwitch('mainnet')}
                  className={network === 'mainnet' ? 'bg-muted' : ''}
                >
                  <Network className="h-4 w-4 mr-2" />
                  Mainnet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Wallet Connection */}
          {isConnected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 cursor-pointer">
                  <Wallet className="h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">
                      {getDisplayAddress()}
                    </span>
                    <span className="font-mono text-xs">
                      {getDisplayBalance()} XLM
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <div className="text-sm font-medium">Connected Wallet</div>
                  <div className="font-mono text-xs text-muted-foreground break-all">
                    {address}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={copyAddress}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openInExplorer}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Explorer
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={handleConnect} 
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}