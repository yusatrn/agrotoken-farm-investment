// Core Smart Contract Types (matching the deployed contract)
export interface AssetMetadata {
  name: string;
  symbol: string;
  asset_type: string;
  description: string;
  valuation: string; // i128 as string to handle large numbers
  last_valuation_date: number; // u64 timestamp
  legal_doc_hash: string;
}

export interface ComplianceData {
  kyc_verified: boolean;
  accredited_investor: boolean;
  jurisdiction: string;
  compliance_expiry: number; // u64 timestamp
}

export interface Transaction {
  id: string;
  type: 'transfer' | 'mint' | 'burn';
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  txHash?: string;
  blockNumber?: number;
}

export interface ContractInfo {
  contractId: string;
  admin: string;
  totalSupply: string;
  isPaused: boolean;
  metadata: AssetMetadata;
}

// Wallet Connection Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  publicKey: string | null;
  balance: string;
  network: 'testnet' | 'mainnet';
}

// Tokenization System Types
export interface TokenizationProject {
  id: string;
  status: 'draft' | 'review' | 'approved' | 'deployed' | 'live';
  creatorAddress: string;
  assetDetails: {
    name: string;
    type: 'real_estate' | 'commodities' | 'art' | 'infrastructure';
    location: string;
    description: string;
    totalValue: string;
    images: string[];
    address?: string; // Physical address for real estate
  };
  tokenomics: {
    tokenName: string;
    tokenSymbol: string;
    totalSupply: string;
    pricePerToken: string;
    minimumInvestment: string;
    lockupPeriod?: number; // in days
  };
  legal: {
    jurisdiction: string;
    regulatoryFramework: string;
    documents: LegalDocument[];
    complianceRequirements: string[];
  };
  financials: {
    projectedYield: string; // percentage as string
    managementFee: string; // percentage as string
    distributionFrequency: 'monthly' | 'quarterly' | 'annually';
    estimatedAppreciation: string; // percentage as string
  };
  contractId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface LegalDocument {
  id: string;
  type: 'deed' | 'appraisal' | 'legal_opinion' | 'insurance' | 'financial_statement' | 'environmental_report';
  name: string;
  hash: string;
  ipfsHash?: string;
  uploadDate: number;
  verified: boolean;
  projectId: string;
  fileSize: number;
  mimeType: string;
}

export interface InvestmentOpportunity {
  projectId: string;
  assetName: string;
  assetType: string;
  location: string;
  totalValue: string;
  availableTokens: string;
  pricePerToken: string;
  projectedYield: string;
  minimumInvestment: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'live' | 'sold_out';
  launchDate: number;
  images: string[];
  contractId?: string;
}

export interface InvestmentCalculation {
  tokenAmount: string;
  totalCost: string;
  projectedAnnualReturn: string;
  projectedMonthlyIncome: string;
  breakEvenPeriod: string;
  riskAssessment: 'low' | 'medium' | 'high';
  fees: {
    networkFee: string;
    managementFee: string;
    totalFees: string;
  };
}

// Portfolio & User Data Types
export interface Portfolio {
  totalValue: string;
  totalTokens: number;
  assets: PortfolioAsset[];
  performance24h: string;
  performanceAllTime: string;
}

export interface PortfolioAsset {
  contractId: string;
  name: string;
  symbol: string;
  balance: string;
  currentValue: string;
  performance24h: string;
  assetType: string;
  location?: string;
}

// Admin & Management Types
export interface AdminAction {
  id: string;
  type: 'mint' | 'whitelist_add' | 'whitelist_remove' | 'compliance_update' | 'pause' | 'unpause' | 'valuation_update';
  targetAddress?: string;
  amount?: string;
  timestamp: number;
  executedBy: string;
  status: 'pending' | 'executed' | 'failed';
  txHash?: string;
}

export interface WhitelistEntry {
  address: string;
  addedDate: number;
  addedBy: string;
  status: 'active' | 'removed';
  compliance?: ComplianceData;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  operation?: string;
  progress?: number; // 0-100 for progress bars
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
  retry?: () => void;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  autoClose?: boolean;
  duration?: number; // in milliseconds
}

// Network & Configuration Types
export interface NetworkConfig {
  name: string;
  networkPassphrase: string;
  horizonUrl: string;
  sorobanUrl: string;
  explorerUrl: string;
}

export interface ContractConfig {
  contractId: string;
  network: 'testnet' | 'mainnet';
  adminAddress: string;
}

// Marketplace Filter Types
export interface MarketplaceFilters {
  assetType: string[];
  location: string[];
  priceRange: [number, number];
  yieldRange: [number, number];
  riskLevel: string[];
  status: string[];
  sortBy: 'price' | 'yield' | 'launch_date' | 'total_value';
  sortOrder: 'asc' | 'desc';
}

// Form Types for Multi-step Wizard
export interface AssetDetailsFormData {
  name: string;
  type: 'real_estate' | 'commodities' | 'art' | 'infrastructure';
  location: string;
  address: string;
  description: string;
  totalValue: string;
  images: File[];
}

export interface TokenomicsFormData {
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  pricePerToken: string;
  minimumInvestment: string;
  lockupPeriod: number;
}

export interface LegalFormData {
  jurisdiction: string;
  regulatoryFramework: string;
  complianceRequirements: string[];
  documents: File[];
}

export interface FinancialsFormData {
  projectedYield: string;
  managementFee: string;
  distributionFrequency: 'monthly' | 'quarterly' | 'annually';
  estimatedAppreciation: string;
} 