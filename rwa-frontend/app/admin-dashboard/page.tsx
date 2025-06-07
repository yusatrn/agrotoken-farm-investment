'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useWalletStore } from '@/stores/wallet';

export default function AdminDashboardPage() {
  const { address, isConnected, connect } = useWalletStore();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingMints, setPendingMints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if the connected wallet is an admin
  useEffect(() => {
    if (address) {
      checkAdminStatus();
      loadPendingMints();
    }
  }, [address]);

  const checkAdminStatus = async () => {
    try {
      // In a real implementation, this would check if the wallet is the contract admin
      const response = await fetch(`/api/check-admin?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setIsAdmin(data.isAdmin);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  };

  const loadPendingMints = async () => {
    if (!address) return;
    
    setIsLoading(true);
    
    try {
      // Fetch pending minting operations
      const response = await fetch('/api/queue-mint');
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success && data.stats) {
          // For demonstration, create some sample items
          const samplePendingMints = [
            {
              id: 'mint-123',
              address: 'GA2C5RFPE6GCKMY3US5PAB6UZLKIGSPIUKSLRB6Q7Z5YKLF5426SK37O',
              amount: '100',
              status: 'queued',
              timestamp: Date.now() - 120000
            },
            {
              id: 'mint-456',
              address: 'GBMVIZXSOSAQFCTLXN5MPHRGSMGUTCCHKMZYAX4ZLJ3RL3UGSF3FYJZJ',
              amount: '50',
              status: 'processing',
              timestamp: Date.now() - 60000
            }
          ];
          
          // In a real implementation, we would use data.items or similar
          setPendingMints(samplePendingMints);
        }
      }
    } catch (error) {
      console.error('Failed to load pending mints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualMint = async (queueId: string) => {
    if (!confirm('Are you sure you want to manually mint these tokens?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the mint details
      const mintItem = pendingMints.find(item => item.id === queueId);
      
      if (!mintItem) {
        console.error('Mint item not found');
        return;
      }
      
      // Call the mint API directly
      const response = await fetch('/api/mint-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationAddress: mintItem.address,
          amount: mintItem.amount,
          source: 'admin-dashboard',
          requestId: queueId
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          alert(`Manual mint successful! Transaction hash: ${data.transactionHash}`);
          loadPendingMints(); // Refresh the list
        } else {
          alert(`Manual mint failed: ${data.error}`);
        }
      } else {
        alert('Failed to process manual mint');
      }
    } catch (error) {
      console.error('Manual mint error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Dashboard
            </h1>
            
            {!isConnected ? (
              <div className="bg-yellow-50 p-4 rounded-md">
                <p>Please connect your admin wallet to access this page.</p>
                <Button onClick={connect} className="mt-2">
                  Connect Wallet
                </Button>
              </div>
            ) : !isAdmin ? (
              <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-800">
                  The connected wallet is not authorized as an admin.
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  Connected as admin: {address}
                </p>
              </div>
            )}
          </div>
          
          {isAdmin && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pending Minting Operations</h2>
                <Button 
                  onClick={loadPendingMints} 
                  variant="outline" 
                  disabled={isLoading}
                  className="flex gap-2 items-center"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center p-8">Loading...</div>
              ) : pendingMints.length === 0 ? (
                <Card>
                  <CardContent className="text-center p-8">
                    <p>No pending minting operations found.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingMints.map((mint) => (
                    <Card key={mint.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex justify-between items-center">
                          <span>Queue ID: {mint.id}</span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            mint.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                            mint.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            mint.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {mint.status.toUpperCase()}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Destination Address</p>
                            <p className="font-mono text-sm truncate">{mint.address}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-semibold">{mint.amount} tokens</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Requested</p>
                            <p>{new Date(mint.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => window.open(`https://stellar.expert/explorer/testnet/tx/${mint.id}`, '_blank')}
                          >
                            View on Explorer
                          </Button>
                          <Button 
                            onClick={() => handleManualMint(mint.id)}
                            disabled={mint.status === 'completed'}
                          >
                            Process Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
