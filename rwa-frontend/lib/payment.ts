// Payment system for AgroToken platform
import { 
  Asset,
  TransactionBuilder,
  Operation,
  Networks,
  BASE_FEE,
  Memo
} from '@stellar/stellar-sdk';
import { Horizon } from '@stellar/stellar-sdk';
import { signTransaction, isConnected } from '@stellar/freighter-api';
import { createContractClient } from './contract';

// Supported payment currencies
export interface PaymentCurrency {
  code: string;
  issuer?: string; // For custom assets, undefined for XLM
  name: string;
  decimals: number;
  logo?: string;
  isStableCoin: boolean;
}

export const PAYMENT_CURRENCIES: PaymentCurrency[] = [
  {
    code: 'XLM',
    name: 'Stellar Lumens',
    decimals: 7,
    isStableCoin: false,
    logo: '🚀'
  },
  {
    code: 'USDC',
    issuer: 'GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN', // Circle USDC on Stellar
    name: 'USD Coin',
    decimals: 7,
    isStableCoin: true,
    logo: '💵'
  },
  {
    code: 'USDT',
    issuer: 'GCQTGZQQ5G4PTM2GL7CDIFKUBIPEC52BROAQIAPW53XBRJVN6ZJVTG6V', // Tether USDT on Stellar
    name: 'Tether USD',
    decimals: 7,
    isStableCoin: true,
    logo: '💴'
  }
];

// Investment packages with different currencies
export interface InvestmentPackage {
  id: string;
  name: string;
  description: string;
  farmTokenSymbol: string; // GVOF, AGRO, etc.
  minimumInvestment: Record<string, string>; // currency -> amount
  expectedReturn: string; // APY percentage
  duration: number; // in days
  riskLevel: 'Low' | 'Medium' | 'High';
}

export const INVESTMENT_PACKAGES: InvestmentPackage[] = [
  {
    id: 'organic-farm-basic',
    name: 'Organic Farm - Basic Package',
    description: 'Entry-level investment in certified organic farmland',
    farmTokenSymbol: 'GVOF',
    minimumInvestment: {
      'XLM': '10', // 10 XLM (display format)
      'USDC': '100', // $100 USDC (display format)
      'USDT': '100'  // $100 USDT (display format)
    },
    expectedReturn: '8.5', // 8.5% APY
    duration: 365,
    riskLevel: 'Low'
  },
  {
    id: 'organic-farm-premium',
    name: 'Organic Farm - Premium Package',
    description: 'High-yield investment with guaranteed returns',
    farmTokenSymbol: 'GVOF',
    minimumInvestment: {
      'XLM': '100', // 100 XLM (display format)
      'USDC': '1000', // $1000 USDC (display format)
      'USDT': '1000'  // $1000 USDT (display format)
    },
    expectedReturn: '12.0',
    duration: 365,
    riskLevel: 'Medium'
  },  {
    id: 'agro-technology-fund',
    name: 'AgTech Innovation Fund',
    description: 'Investment in agricultural technology and automation',
    farmTokenSymbol: 'AGRO',
    minimumInvestment: {
      'XLM': '50', // 50 XLM (display format)
      'USDC': '500', // $500 USDC (display format)
      'USDT': '500'  // $500 USDT (display format)
    },
    expectedReturn: '15.0',
    duration: 180,
    riskLevel: 'High'
  }
];

export class PaymentProcessor {
  private network: 'testnet' | 'mainnet';
  private serverUrl: string;

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.network = network;
    this.serverUrl = network === 'mainnet' 
      ? 'https://horizon.stellar.org'
      : 'https://horizon-testnet.stellar.org';
  }

  // Get supported payment methods for a user
  async getSupportedPaymentMethods(userAddress: string): Promise<PaymentCurrency[]> {
    try {
      // In production, we'd check user's account for available balances
      // For now, return all supported currencies
      return PAYMENT_CURRENCIES;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      return PAYMENT_CURRENCIES; // Fallback to all methods
    }
  }
  // Convert payment amount to farm tokens
  calculateFarmTokens(
    paymentAmount: string,
    paymentCurrency: string,
    packageId: string
  ): { farmTokens: string; exchangeRate: string } {
    const investmentPackage = INVESTMENT_PACKAGES.find(p => p.id === packageId);
    if (!investmentPackage) {
      throw new Error('Investment package not found');
    }

    // Simple 1:1 conversion for demo (in production, use real exchange rates)
    const farmTokens = paymentAmount;
    const exchangeRate = '1.0';

    return { farmTokens, exchangeRate };
  }

  // Process investment payment
  async processInvestmentPayment(
    userAddress: string,
    packageId: string,
    paymentAmount: string,
    paymentCurrency: string
  ): Promise<{ success: boolean; transactionHash?: string; farmTokens?: string }> {
    try {
      console.log(`💰 Processing investment payment:`, {
        user: userAddress,
        package: packageId,
        amount: paymentAmount,
        currency: paymentCurrency
      });

      // Check wallet connection
      const connectionResult = await isConnected();
      if (!connectionResult.isConnected) {
        throw new Error('Please connect your Freighter wallet');
      }

      // Get investment package
      const investmentPackage = INVESTMENT_PACKAGES.find(p => p.id === packageId);
      if (!investmentPackage) {
        throw new Error('Investment package not found');
      }      // Validate minimum investment (both values should be in display format)
      const minimumRequired = investmentPackage.minimumInvestment[paymentCurrency];
      const userAmount = parseFloat(paymentAmount);
      const minAmount = parseFloat(minimumRequired);
      
      if (!minimumRequired || userAmount < minAmount) {
        throw new Error(`Minimum investment is ${minimumRequired} ${paymentCurrency}`);
      }// Calculate farm tokens to receive
      const { farmTokens } = this.calculateFarmTokens(
        paymentAmount,
        paymentCurrency,
        packageId
      );      // Create payment transaction
      const transactionHash = await this.createPaymentTransaction(
        userAddress,
        paymentAmount,
        paymentCurrency
      );

      // Mint farm tokens to user (using our contract)
      if (transactionHash) {
        const contractClient = createContractClient();
        
        try {
          await contractClient.mint(userAddress, farmTokens);
          console.log(`✅ Investment successful! Minted ${farmTokens} ${investmentPackage.farmTokenSymbol} tokens`);
        } catch (mintError) {
          console.warn('Payment successful but token minting failed:', mintError);
          // Payment went through, but token minting failed - manual intervention needed
        }
      }

      return {
        success: true,
        transactionHash,
        farmTokens
      };

    } catch (error) {
      console.error('Investment payment failed:', error);
      return {
        success: false
      };
    }
  }  // Create Stellar payment transaction
  private async createPaymentTransaction(
    fromAddress: string,
    amount: string,
    currencyCode: string
  ): Promise<string> {
    const currency = PAYMENT_CURRENCIES.find(c => c.code === currencyCode);
    if (!currency) {
      throw new Error(`Unsupported currency: ${currencyCode}`);
    }

    try {
      console.log(`💸 Creating real Stellar payment transaction:`);
      console.log(`  From: ${fromAddress}`);
      console.log(`  Amount: ${amount} ${currencyCode}`);

      // Import additional required modules
      const { 
        Server, 
        TransactionBuilder, 
        Operation, 
        Networks, 
        BASE_FEE 
      } = await import('@stellar/stellar-sdk');

      // Create Stellar server
      const server = new Server(this.serverUrl);
      
      // Platform treasury address (where investments go)
      const treasuryAddress = 'GDREASURYADDRESSEXAMPLEXXXXXXXXXXXXXXXXXXXXXXXXX';

      // Create asset
      const asset = currency.issuer 
        ? new Asset(currency.code, currency.issuer)
        : Asset.native(); // XLM

      console.log(`📡 Loading account ${fromAddress}...`);
      
      // Load the sender's account
      const account = await server.loadAccount(fromAddress);
      
      console.log(`💰 Creating payment operation: ${amount} ${currencyCode}`);
      
      // Create payment operation
      const paymentOp = Operation.payment({
        destination: treasuryAddress,
        asset: asset,
        amount: amount
      });

      // Build transaction
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET,
      })
        .addOperation(paymentOp)
        .addMemo(
          // Add memo for tracking investment
          this.network === 'mainnet' 
            ? new (await import('@stellar/stellar-sdk')).Memo.text(`AgroToken Investment`)
            : new (await import('@stellar/stellar-sdk')).Memo.text(`AgroToken Test Investment`)
        )
        .setTimeout(300)
        .build();

      console.log(`🔐 Requesting Freighter signature...`);
      
      // Sign with Freighter
      const signedXdr = await signTransaction(transaction.toXDR(), {
        networkPassphrase: this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET,
        address: fromAddress,
      });

      console.log(`📤 Submitting transaction to Stellar network...`);
      
      // Reconstruct signed transaction
      const signedTransaction = TransactionBuilder.fromXDR(
        signedXdr.signedTxXdr, 
        this.network === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET
      );

      // Submit to network
      const result = await server.submitTransaction(signedTransaction);
      
      if (result.successful) {
        console.log(`✅ Payment transaction successful!`);
        console.log(`   Transaction Hash: ${result.hash}`);
        console.log(`   Ledger: ${result.ledger}`);
        return result.hash;
      } else {
        throw new Error(`Transaction failed: ${result.result_xdr}`);
      }

    } catch (error) {
      console.error('❌ Payment transaction failed:', error);
      
      // Handle specific Freighter errors
      if (error instanceof Error) {
        if (error.message.includes('User declined')) {
          throw new Error('Payment cancelled by user');
        }
        if (error.message.includes('insufficient balance')) {
          throw new Error('Insufficient balance for payment');
        }
        if (error.message.includes('Not Found')) {
          throw new Error('Account not found. Please ensure your account is funded.');
        }
      }
      
      throw error;
    }
  }
  // Get investment history for user
  async getUserInvestmentHistory(userAddress: string): Promise<Array<{
    id: string;
    date: string;
    package: string;
    paymentAmount: string;
    paymentCurrency: string;
    farmTokensReceived: string;
    farmTokenSymbol: string;
    status: string;
    transactionHash: string;
  }>> {
    // In production, query blockchain for payment history
    // Suppress unused parameter warning for now
    console.log('Getting investment history for:', userAddress);
    
    return [
      {
        id: '1',
        date: new Date().toISOString(),
        package: 'Organic Farm - Basic Package',
        paymentAmount: '100.00',
        paymentCurrency: 'USDC',
        farmTokensReceived: '100.00',
        farmTokenSymbol: 'GVOF',
        status: 'Completed',
        transactionHash: 'example_hash_123'
      }
    ];
  }

  // Calculate current portfolio value
  async getPortfolioValue(userAddress: string): Promise<{
    totalValue: string;
    currency: string;
    holdings: Array<{
      tokenSymbol: string;
      amount: string;
      currentValue: string;
      gainLoss: string;
      gainLossPercentage: string;
    }>;
  }> {
    try {
      const contractClient = createContractClient();
      
      // Get user's farm token balances
      const balance = await contractClient.balance(userAddress);
      
      // Calculate current value (simplified)
      const currentValue = balance; // 1:1 for demo
      
      return {
        totalValue: currentValue,
        currency: 'USD',
        holdings: [
          {
            tokenSymbol: 'GVOF',
            amount: balance,
            currentValue: currentValue,
            gainLoss: '+0.00',
            gainLossPercentage: '0.00'
          }
        ]
      };
    } catch (error) {
      console.error('Error calculating portfolio value:', error);
      return {
        totalValue: '0',
        currency: 'USD',
        holdings: []
      };
    }
  }
}

// Format currency amounts for display
export const formatCurrencyAmount = (
  amount: string,
  currencyCode: string,
  fromStroops: boolean = false
): string => {
  const currency = PAYMENT_CURRENCIES.find(c => c.code === currencyCode);
  
  // If fromStroops is true, convert from stroops format, otherwise use display format
  const num = fromStroops 
    ? parseFloat(amount) / Math.pow(10, currency?.decimals || 7)
    : parseFloat(amount);
  
  if (currency?.isStableCoin) {
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${currencyCode}`;
};

// Get real-time exchange rates (mock for now)
export const getExchangeRates = async (): Promise<Record<string, number>> => {
  // In production, integrate with price APIs
  return {
    'XLM': 0.12, // XLM to USD
    'USDC': 1.00,
    'USDT': 1.00
  };
};

export default PaymentProcessor;
