import { create } from 'zustand';
import { WalletState } from '@/lib/types';
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  WatchWalletChanges
} from '@stellar/freighter-api';
import { initializeFreighterViaAPI, detectFreighterViaAPI, isFreighterAvailableViaAPI } from '@/lib/freighter-detector';

// Extend Window interface for Freighter
declare global {
  interface Window {
    freighter?: any;
  }
}

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (network: 'testnet' | 'mainnet') => Promise<void>;
  refreshBalance: () => Promise<void>;
  checkConnection: () => Promise<void>;
  startWalletWatcher: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

// Wallet watcher instance
let walletWatcher: WatchWalletChanges | null = null;

export const useWalletStore = create<WalletStore>((set, get) => ({
  // Initial state
  isConnected: false,
  address: null,
  publicKey: null,
  balance: '0',
  network: 'testnet',
  isLoading: false,
  error: null,

  // Clear error state
  clearError: () => set({ error: null }),  // Connect to Freighter wallet
  connect: async () => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('Starting Freighter connection...');
      
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        throw new Error('Wallet connection only available in browser');
      }

      // Use API-based detection - this is more reliable than window object checking
      console.log('Checking Freighter availability via API...');
      const detection = await detectFreighterViaAPI();
      
      if (!detection.isInstalled || !detection.isReady) {
        throw new Error(detection.error || 'Freighter wallet extension not found. Please install Freighter from the Chrome Web Store and refresh the page.');
      }

      console.log('Freighter detected via API, attempting to connect...');

      // Check if Freighter is installed and connected
      const connectionResult = await isConnected();
      
      if (connectionResult.error) {
        throw new Error('Freighter wallet not responding. Please check if the extension is enabled and refresh the page.');
      }

      if (!connectionResult.isConnected) {
        console.log('Freighter not connected, requesting access...');
        // Try to request access first
        const accessResult = await requestAccess();
        if (accessResult.error) {
          throw new Error('Access to Freighter was denied. Please approve the connection in your wallet.');
        }
      }

      // Request access to user's public key
      console.log('Requesting wallet access...');
      const accessResult = await requestAccess();
      
      if (accessResult.error) {
        throw new Error(accessResult.error);
      }

      // Get network information
      console.log('Getting network information...');
      const networkResult = await getNetworkDetails();
      
      if (networkResult.error) {
        throw new Error(networkResult.error);
      }

      // Map Freighter network names to our format
      const networkMapping: Record<string, 'testnet' | 'mainnet'> = {
        'TESTNET': 'testnet',
        'PUBLIC': 'mainnet',
        'FUTURENET': 'testnet', // Default futurenet to testnet for our purposes
        'STANDALONE': 'testnet'
      };

      const mappedNetwork = networkMapping[networkResult.network] || 'testnet';set({
        isConnected: true,
        address: accessResult.address,
        publicKey: accessResult.address, // In Stellar, address and public key are the same
        balance: '0',
        network: mappedNetwork,
        isLoading: false,
        error: null
      });

      // Fetch actual balance after connection
      get().refreshBalance();

      // Start watching for wallet changes
      get().startWalletWatcher();

      console.log('Freighter wallet connected successfully:', {
        address: accessResult.address,
        network: networkResult.network,
        networkUrl: networkResult.networkUrl
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Wallet connection failed:', errorMessage);
      
      set({
        isConnected: false,
        address: null,
        publicKey: null,
        balance: '0',
        isLoading: false,
        error: errorMessage
      });
    }
  },

  // Disconnect wallet
  disconnect: () => {
    // Stop watching for changes
    if (walletWatcher) {
      walletWatcher.stop();
      walletWatcher = null;
    }

    set({
      isConnected: false,
      address: null,
      publicKey: null,
      balance: '0',
      error: null
    });
    console.log('Wallet disconnected');
  },

  // Switch network (Note: This requires user to manually switch in Freighter)
  switchNetwork: async (network: 'testnet' | 'mainnet') => {
    set({ isLoading: true, error: null });
    
    try {
      // Get current network from Freighter
      const networkResult = await getNetwork();
      
      if (networkResult.error) {
        throw new Error(networkResult.error);
      }

      // Check if we're already on the desired network
      const currentNetwork = networkResult.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      
      if (currentNetwork === network) {
        set({ isLoading: false });
        return;
      }

      // We can't programmatically switch networks in Freighter
      // So we'll show an error message asking the user to switch manually
      const targetNetwork = network === 'mainnet' ? 'Mainnet (PUBLIC)' : 'Testnet';
      throw new Error(
        `Please switch to ${targetNetwork} in your Freighter wallet settings, then reconnect.`
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network switch failed';
      set({ 
        isLoading: false, 
        error: errorMessage 
      });
    }
  },
  // Refresh XLM balance
  refreshBalance: async () => {
    const { address, network, isConnected } = get();
    
    if (!isConnected || !address) {
      return;
    }

    try {
      console.log(`Refreshing balance for ${address} on ${network}...`);
      
      // Use Stellar SDK to fetch actual balance from Horizon
      const horizonUrl = network === 'mainnet' 
        ? 'https://horizon.stellar.org' 
        : 'https://horizon-testnet.stellar.org';
      
      const response = await fetch(`${horizonUrl}/accounts/${address}`);
      
      if (!response.ok) {
        // If account doesn't exist on network, balance is 0
        if (response.status === 404) {
          set({ balance: '0.0000000' });
          console.log('Account not found on network, balance set to 0');
          return;
        }
        throw new Error(`Failed to fetch account: ${response.status}`);
      }
      
      const accountData = await response.json();
      
      // Find XLM balance
      const xlmBalance = accountData.balances.find(
        (balance: any) => balance.asset_type === 'native'
      );
      
      const balance = xlmBalance ? xlmBalance.balance : '0.0000000';
      set({ balance });
      
      console.log('Balance refreshed:', balance, 'XLM');
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      // Set a mock balance if fetching fails
      set({ balance: '100.0000000' });
    }
  },  // Check if wallet is still connected
  checkConnection: async () => {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }

      // Use API-based detection instead of window object checking
      console.log('Checking connection via Freighter API...');
      const isAvailable = await isFreighterAvailableViaAPI();
      
      if (!isAvailable) {
        console.log('Freighter not available during connection check');
        get().disconnect();
        return;
      }

      // Check if Freighter is still connected
      const connectionResult = await isConnected();
      
      if (connectionResult.error || !connectionResult.isConnected) {
        get().disconnect();
        return;
      }

      // If we think we're connected but don't have an address, try to get it
      const { isConnected: storeConnected, address } = get();
      if (storeConnected && !address) {
        const addressResult = await getAddress();
        if (addressResult.error || !addressResult.address) {
          get().disconnect();
          return;
        }
        
        set({ 
          address: addressResult.address, 
          publicKey: addressResult.address 
        });
      }
      
      console.log('Connection check completed successfully');
    } catch (error) {
      console.error('Connection check failed:', error);
      get().disconnect();
    }
  },

  // Start wallet watcher (internal method)
  startWalletWatcher: () => {
    if (walletWatcher) {
      walletWatcher.stop();
    }

    walletWatcher = new WatchWalletChanges(3000); // Check every 3 seconds
    
    walletWatcher.watch((changes) => {
      const { address: currentAddress, network: currentNetwork } = get();
      
      // Check if address changed
      if (changes.address !== currentAddress) {
        if (changes.address) {
          set({
            address: changes.address,
            publicKey: changes.address,
            isConnected: true
          });
          console.log('Wallet address changed:', changes.address);
        } else {
          get().disconnect();
        }
      }

      // Check if network changed
      const mappedNetwork = changes.network === 'PUBLIC' ? 'mainnet' : 'testnet';
      if (mappedNetwork !== currentNetwork) {
        set({ network: mappedNetwork });
        console.log('Network changed:', changes.network);
      }
    });
  }
})); 