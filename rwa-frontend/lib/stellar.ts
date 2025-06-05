import { Networks, Keypair } from '@stellar/stellar-sdk';
import { NetworkConfig } from './types';

// Network configurations
export const NETWORKS: Record<'testnet' | 'mainnet', NetworkConfig> = {
  testnet: {
    name: 'Testnet',
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/testnet'
  },
  mainnet: {
    name: 'Mainnet',
    networkPassphrase: Networks.PUBLIC,
    horizonUrl: 'https://horizon.stellar.org',
    sorobanUrl: 'https://mainnet.sorobanrpc.com',
    explorerUrl: 'https://stellar.expert/explorer/public'
  }
};

// Default network for development - use environment variable or default to testnet
export const DEFAULT_NETWORK: 'testnet' | 'mainnet' = 
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'mainnet') || 'testnet';

// Your deployed RWA contract ID
export const RWA_CONTRACT_ID = 'CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX';

// Create Soroban RPC server instance
export const createSorobanServer = (network: 'testnet' | 'mainnet' = DEFAULT_NETWORK) => {
  // Return the URL for now - will implement proper RPC client later
  return NETWORKS[network].sorobanUrl;
};

// Format token amounts for display (contract uses 7 decimal places)
export const formatTokenAmount = (amount: string | number, decimals = 7): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = (num / Math.pow(10, decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatted;
};

// Convert display amount to contract amount (multiply by 10^7)
export const toContractAmount = (displayAmount: string | number): string => {
  const num = typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount;
  return Math.floor(num * Math.pow(10, 7)).toString();
};

// Convert contract amount to display amount (divide by 10^7)
export const toDisplayAmount = (contractAmount: string | number): number => {
  const num = typeof contractAmount === 'string' ? parseInt(contractAmount) : contractAmount;
  return num / Math.pow(10, 7);
};

// Format currency values
export const formatCurrency = (amount: string | number, currency = 'USD'): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
};

// Format percentage values
export const formatPercentage = (value: string | number, decimals = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return `${num.toFixed(decimals)}%`;
};

// Validate Stellar address format
export const isValidStellarAddress = (address: string): boolean => {
  try {
    // Stellar addresses start with 'G' and are 56 characters long
    if (!address || address.length !== 56 || !address.startsWith('G')) {
      return false;
    }
    
    // Try to create a Keypair to validate the address format
    Keypair.fromPublicKey(address);
    return true;
  } catch {
    return false;
  }
};

// Validate contract ID format
export const isValidContractId = (contractId: string): boolean => {
  try {
    // Contract IDs start with 'C' and are 56 characters long
    if (!contractId || contractId.length !== 56 || !contractId.startsWith('C')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

// Create explorer URL for address or transaction
export const getExplorerUrl = (
  identifier: string, 
  type: 'account' | 'contract' | 'tx' = 'account',
  network: 'testnet' | 'mainnet' = DEFAULT_NETWORK
): string => {
  const baseUrl = NETWORKS[network].explorerUrl;
  return `${baseUrl}/${type}/${identifier}`;
};

// Truncate address for display
export const truncateAddress = (address: string, startChars = 6, endChars = 6): string => {
  if (!address || address.length <= startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Calculate network fees (simplified estimation)
export const estimateNetworkFee = (operationType: 'transfer' | 'mint' | 'admin'): string => {
  // Basic fee estimation - in practice, this would query the network
  const baseFee = 100; // 100 stroops base fee
  const operationMultiplier = {
    transfer: 1,
    mint: 2,
    admin: 3
  };
  
  const totalFee = baseFee * operationMultiplier[operationType];
  return (totalFee / 10000000).toString(); // Convert stroops to XLM
};

// Time formatting utilities
export const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffMs = now - (timestamp * 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return formatTimestamp(timestamp);
};

// Investment calculation utilities
export const calculateInvestmentMetrics = (
  investmentAmount: number,
  pricePerToken: number,
  projectedYield: number,
  managementFee: number = 2
) => {
  const tokenAmount = investmentAmount / pricePerToken;
  const grossAnnualReturn = (investmentAmount * projectedYield) / 100;
  const managementFeeAmount = (investmentAmount * managementFee) / 100;
  const netAnnualReturn = grossAnnualReturn - managementFeeAmount;
  const monthlyReturn = netAnnualReturn / 12;

  return {
    tokenAmount: tokenAmount.toFixed(6),
    grossAnnualReturn: grossAnnualReturn.toFixed(2),
    managementFeeAmount: managementFeeAmount.toFixed(2),
    netAnnualReturn: netAnnualReturn.toFixed(2),
    monthlyReturn: monthlyReturn.toFixed(2),
    breakEvenMonths: Math.ceil(investmentAmount / monthlyReturn)
  };
};

// Risk assessment based on asset type and yield
export const assessRiskLevel = (
  assetType: string,
  projectedYield: number,
  location?: string
): 'low' | 'medium' | 'high' => {
  let riskScore = 0;

  // Asset type scoring
  switch (assetType) {
    case 'real_estate':
      riskScore += location?.includes('Manhattan') ? 1 : 2;
      break;
    case 'commodities':
      riskScore += 3;
      break;
    case 'art':
      riskScore += 4;
      break;
    case 'infrastructure':
      riskScore += 1;
      break;
    default:
      riskScore += 2;
  }

  // Yield scoring (higher yield = higher risk)
  if (projectedYield > 15) riskScore += 3;
  else if (projectedYield > 8) riskScore += 2;
  else if (projectedYield > 4) riskScore += 1;

  if (riskScore <= 2) return 'low';
  if (riskScore <= 4) return 'medium';
  return 'high';
};

// Generate unique IDs
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Validation utilities
export const validatePositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

export const validatePercentage = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0 && num <= 100;
};

// Error handling utilities
export const parseContractError = (error: unknown): string => {
  if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
    const errorMessage = (error as Error).message;
    // Parse common Soroban error messages
    if (errorMessage.includes('insufficient_balance')) {
      return 'Insufficient balance for this transaction';
    }
    if (errorMessage.includes('not_whitelisted')) {
      return 'Address not whitelisted for this asset';
    }
    if (errorMessage.includes('compliance_expired')) {
      return 'Compliance verification has expired';
    }
    if (errorMessage.includes('contract_paused')) {
      return 'Contract is currently paused';
    }
    return errorMessage;
  }
  
  return 'Unknown error occurred';
}; 