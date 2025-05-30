import { AssetMetadata, ComplianceData, ContractInfo } from './types';
import { RWA_CONTRACT_ID, createSorobanServer, parseContractError } from './stellar';

// Contract method signatures
export interface ContractMethods {
  // View functions
  balance: (address: string) => Promise<string>;
  getAssetMetadata: () => Promise<AssetMetadata>;
  totalSupply: () => Promise<string>;
  isWhitelisted: (address: string) => Promise<boolean>;
  getCompliance: (address: string) => Promise<ComplianceData>;
  isPaused: () => Promise<boolean>;
  getAdmin: () => Promise<string>;

  // State-changing functions
  transfer: (from: string, to: string, amount: string) => Promise<boolean>;
  mint: (to: string, amount: string) => Promise<boolean>;
  burn: (from: string, amount: string) => Promise<boolean>;
  addCompliance: (address: string, compliance: ComplianceData) => Promise<boolean>;
  addToWhitelist: (address: string) => Promise<boolean>;
  removeFromWhitelist: (address: string) => Promise<boolean>;
  updateAssetValuation: (newValuation: string) => Promise<boolean>;
  pause: () => Promise<boolean>;
  unpause: () => Promise<boolean>;
}

// Mock contract client for development
// In production, this would use actual Stellar SDK contract invocation
class MockContractClient implements ContractMethods {
  private contractId: string;
  private networkUrl: string;

  constructor(contractId: string = RWA_CONTRACT_ID, network: 'testnet' | 'mainnet' = 'testnet') {
    this.contractId = contractId;
    this.networkUrl = createSorobanServer(network);
  }

  // Mock asset metadata matching our deployed contract
  private mockAssetMetadata: AssetMetadata = {
    name: 'Luxury Apartment NYC',
    symbol: 'LAPT',
    asset_type: 'real_estate',
    description: 'Premium Manhattan apartment tokenized for fractional ownership',
    valuation: '25000000000000', // $2.5M in stroops
    last_valuation_date: Math.floor(Date.now() / 1000),
    legal_doc_hash: 'deed_hash_abc123'
  };

  // View functions
  async balance(address: string): Promise<string> {
    try {
      // Mock implementation - in production, this would call the actual contract
      console.log(`Querying balance for ${address} on contract ${this.contractId}`);
      
      // Return a mock balance based on address
      if (address.includes('admin')) return '1000000000000'; // 100,000 tokens
      if (address.includes('test')) return '100000000000'; // 10,000 tokens
      return '10000000000'; // 1,000 tokens default
    } catch (error) {
      console.error('Error querying balance:', error);
      throw new Error(parseContractError(error));
    }
  }

  async getAssetMetadata(): Promise<AssetMetadata> {
    try {
      console.log(`Getting asset metadata for contract ${this.contractId}`);
      return this.mockAssetMetadata;
    } catch (error) {
      console.error('Error getting asset metadata:', error);
      throw new Error(parseContractError(error));
    }
  }

  async totalSupply(): Promise<string> {
    try {
      console.log(`Getting total supply for contract ${this.contractId}`);
      return '25000000000000000'; // 2.5M tokens
    } catch (error) {
      console.error('Error getting total supply:', error);
      throw new Error(parseContractError(error));
    }
  }

  async isWhitelisted(address: string): Promise<boolean> {
    try {
      console.log(`Checking whitelist status for ${address}`);
      // Mock: addresses containing 'admin' or 'test' are whitelisted
      return address.includes('admin') || address.includes('test') || address.includes('G');
    } catch (error) {
      console.error('Error checking whitelist:', error);
      throw new Error(parseContractError(error));
    }
  }

  async getCompliance(address: string): Promise<ComplianceData> {
    try {
      console.log(`Getting compliance data for ${address}`);
      return {
        kyc_verified: true,
        accredited_investor: address.includes('admin'),
        jurisdiction: 'US',
        compliance_expiry: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60) // 1 year from now
      };
    } catch (error) {
      console.error('Error getting compliance:', error);
      throw new Error(parseContractError(error));
    }
  }

  async isPaused(): Promise<boolean> {
    try {
      console.log(`Checking if contract ${this.contractId} is paused`);
      return false; // Mock: contract is not paused
    } catch (error) {
      console.error('Error checking pause status:', error);
      throw new Error(parseContractError(error));
    }
  }

  async getAdmin(): Promise<string> {
    try {
      console.log(`Getting admin address for contract ${this.contractId}`);
      return 'GADMIN...EXAMPLE'; // Mock admin address
    } catch (error) {
      console.error('Error getting admin:', error);
      throw new Error(parseContractError(error));
    }
  }

  // State-changing functions
  async transfer(from: string, to: string, amount: string): Promise<boolean> {
    try {
      console.log(`Transfer: ${amount} tokens from ${from} to ${to}`);
      
      // Mock validation
      if (!await this.isWhitelisted(from) || !await this.isWhitelisted(to)) {
        throw new Error('Both addresses must be whitelisted');
      }

      const fromBalance = await this.balance(from);
      if (parseInt(fromBalance) < parseInt(amount)) {
        throw new Error('Insufficient balance');
      }

      // Mock successful transfer
      console.log('Transfer successful');
      return true;
    } catch (error) {
      console.error('Transfer failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async mint(to: string, amount: string): Promise<boolean> {
    try {
      console.log(`Minting ${amount} tokens to ${to}`);
      
      if (!await this.isWhitelisted(to)) {
        throw new Error('Recipient must be whitelisted');
      }

      // Mock successful mint
      console.log('Mint successful');
      return true;
    } catch (error) {
      console.error('Mint failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async burn(from: string, amount: string): Promise<boolean> {
    try {
      console.log(`Burning ${amount} tokens from ${from}`);
      
      const balance = await this.balance(from);
      if (parseInt(balance) < parseInt(amount)) {
        throw new Error('Insufficient balance to burn');
      }

      // Mock successful burn
      console.log('Burn successful');
      return true;
    } catch (error) {
      console.error('Burn failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async addCompliance(address: string, compliance: ComplianceData): Promise<boolean> {
    try {
      console.log(`Adding compliance for ${address}:`, compliance);
      
      // Mock successful compliance addition
      console.log('Compliance added successfully');
      return true;
    } catch (error) {
      console.error('Add compliance failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async addToWhitelist(address: string): Promise<boolean> {
    try {
      console.log(`Adding ${address} to whitelist`);
      
      // Mock successful whitelist addition
      console.log('Address added to whitelist');
      return true;
    } catch (error) {
      console.error('Add to whitelist failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async removeFromWhitelist(address: string): Promise<boolean> {
    try {
      console.log(`Removing ${address} from whitelist`);
      
      // Mock successful whitelist removal
      console.log('Address removed from whitelist');
      return true;
    } catch (error) {
      console.error('Remove from whitelist failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async updateAssetValuation(newValuation: string): Promise<boolean> {
    try {
      console.log(`Updating asset valuation to ${newValuation}`);
      
      // Update mock metadata
      this.mockAssetMetadata.valuation = newValuation;
      this.mockAssetMetadata.last_valuation_date = Math.floor(Date.now() / 1000);
      
      console.log('Asset valuation updated');
      return true;
    } catch (error) {
      console.error('Update valuation failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async pause(): Promise<boolean> {
    try {
      console.log(`Pausing contract ${this.contractId}`);
      
      // Mock successful pause
      console.log('Contract paused');
      return true;
    } catch (error) {
      console.error('Pause failed:', error);
      throw new Error(parseContractError(error));
    }
  }

  async unpause(): Promise<boolean> {
    try {
      console.log(`Unpausing contract ${this.contractId}`);
      
      // Mock successful unpause
      console.log('Contract unpaused');
      return true;
    } catch (error) {
      console.error('Unpause failed:', error);
      throw new Error(parseContractError(error));
    }
  }
}

// Contract client factory
export const createContractClient = (
  contractId: string = RWA_CONTRACT_ID,
  network: 'testnet' | 'mainnet' = 'testnet'
): ContractMethods => {
  return new MockContractClient(contractId, network);
};

// Convenience functions for common operations
export const getContractInfo = async (
  contractId: string = RWA_CONTRACT_ID,
  network: 'testnet' | 'mainnet' = 'testnet'
): Promise<ContractInfo> => {
  const client = createContractClient(contractId, network);
  
  const [metadata, totalSupply, isPaused, admin] = await Promise.all([
    client.getAssetMetadata(),
    client.totalSupply(),
    client.isPaused(),
    client.getAdmin()
  ]);

  return {
    contractId,
    admin,
    totalSupply,
    isPaused,
    metadata
  };
};

export const getUserContractData = async (
  userAddress: string,
  contractId: string = RWA_CONTRACT_ID,
  network: 'testnet' | 'mainnet' = 'testnet'
) => {
  const client = createContractClient(contractId, network);
  
  const [balance, isWhitelisted, compliance] = await Promise.all([
    client.balance(userAddress),
    client.isWhitelisted(userAddress),
    client.getCompliance(userAddress).catch(() => null) // Compliance might not exist
  ]);

  return {
    balance,
    isWhitelisted,
    compliance
  };
};

// Helper for batch operations
export const batchWhitelistAddresses = async (
  addresses: string[],
  contractId: string = RWA_CONTRACT_ID,
  network: 'testnet' | 'mainnet' = 'testnet'
): Promise<{ success: string[]; failed: { address: string; error: string }[] }> => {
  const client = createContractClient(contractId, network);
  const success: string[] = [];
  const failed: { address: string; error: string }[] = [];

  for (const address of addresses) {
    try {
      await client.addToWhitelist(address);
      success.push(address);
    } catch (error) {
      failed.push({
        address,
        error: parseContractError(error)
      });
    }
  }

  return { success, failed };
}; 