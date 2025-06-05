'use client';

import { useWalletStore } from '@/stores/wallet';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { detectFreighterViaAPI, isFreighterAvailableViaAPI } from '@/lib/freighter-detector';

export function useWalletConnection() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const { 
    isConnected, 
    address, 
    balance, 
    network, 
    isLoading, 
    error, 
    connect, 
    disconnect, 
    checkConnection, 
    clearError 
  } = useWalletStore();

  // Initialize wallet connection check
  useEffect(() => {
    const initializeWallet = async () => {
      if (!isInitialized && typeof window !== 'undefined') {
        setIsRestoring(true);
        console.log('🔄 Initializing wallet connection...');
        await checkConnection();
        setIsRestoring(false);
        setIsInitialized(true);
      }
    };

    initializeWallet();
  }, [checkConnection, isInitialized]);// Handle wallet connection with user feedback
  const handleConnect = async () => {
    clearError();
    
    try {
      // Use API-based detection instead of window object checking
      if (typeof window === 'undefined') {
        toast.error('Wallet connection only available in browser');
        return;
      }

      // Check if Freighter is available using API
      console.log('Checking Freighter via API before connection...');
      const detection = await detectFreighterViaAPI();
      
      if (!detection.isInstalled || !detection.isReady) {
        toast.error('Freighter wallet not found. Please install Freighter extension and refresh the page.', {
          action: {
            label: 'Install Freighter',
            onClick: () => window.open('https://freighter.app/', '_blank')
          },
          duration: 8000
        });
        return;
      }

      // Try to connect
      await connect();
      toast.success('Wallet connected successfully! 🎉');
      
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      
      if (message.includes('not found') || message.includes('not detected')) {
        toast.error('Freighter wallet extension not properly installed. Please install from freighter.app and refresh the page.', {
          action: {
            label: 'Install Freighter',
            onClick: () => window.open('https://freighter.app/', '_blank')
          },
          duration: 8000
        });
      } else {
        toast.error(message, {
          action: {
            label: 'Try Again',
            onClick: () => handleConnect()
          }
        });
      }
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnect();
    toast.info('Wallet disconnected');
  };  // Check if Freighter is installed using API (instead of window object)
  const isFreighterInstalled = async () => {
    if (typeof window === 'undefined') return false;
    return await isFreighterAvailableViaAPI();
  };

  // Get display-friendly address (shortened)
  const getDisplayAddress = () => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Get display-friendly balance
  const getDisplayBalance = () => {
    if (!balance) return '0.00';
    const numBalance = parseFloat(balance);
    return numBalance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Get network display name
  const getNetworkDisplay = () => {
    return network === 'mainnet' ? 'Mainnet' : 'Testnet';
  };
  return {    // State
    isConnected,
    address,
    balance,
    network,
    isLoading,
    isRestoring,
    error,
    isInitialized,
    
    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    clearError,
    
    // Utilities
    isFreighterInstalled,
    getDisplayAddress,
    getDisplayBalance,
    getNetworkDisplay,
  };
}
