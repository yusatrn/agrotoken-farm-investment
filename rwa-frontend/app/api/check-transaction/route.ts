// API route for checking transaction status
import { NextRequest, NextResponse } from 'next/server';
import { rpc } from '@stellar/stellar-sdk';
import { parseContractError } from '../../../lib/stellar';

// Get network configuration
const NETWORK = process.env.STELLAR_NETWORK || 'testnet';

// Helper to get Soroban RPC server URL
function getServerUrl(): string {
  return NETWORK === 'mainnet' 
    ? 'https://mainnet.sorobanrpc.com' 
    : 'https://soroban-testnet.stellar.org';
}

// Cache transaction results to reduce API calls
const transactionCache = new Map<string, {
  status: string;
  details?: any;
  timestamp: number;
}>();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Get transaction hash from query params
    const url = new URL(request.url);
    const txHash = url.searchParams.get('hash');
    
    if (!txHash) {
      return NextResponse.json(
        { success: false, error: 'Missing transaction hash' },
        { status: 400 }
      );
    }
    
    // Check if we have a recent cache entry (less than 30 seconds old)
    const cacheEntry = transactionCache.get(txHash);
    if (cacheEntry && Date.now() - cacheEntry.timestamp < 30000) {
      return NextResponse.json({
        success: true,
        status: cacheEntry.status,
        details: cacheEntry.details,
        cached: true,
        timestamp: cacheEntry.timestamp
      });
    }
    
    // Initialize RPC server connection
    const serverUrl = getServerUrl();
    const server = new rpc.Server(serverUrl, {
      allowHttp: false,
      timeout: 30000, // 30s timeout
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log(`Checking transaction status for hash: ${txHash}`);
    
    // Query the transaction status
    const txResult = await server.getTransaction(txHash).catch((error) => {
      console.error('Error fetching transaction:', error);
      return null;
    });
    
    if (!txResult) {
      // Transaction not found or still pending
      const response = { 
        success: true, 
        status: 'PENDING',
        message: 'Transaction not found or still pending'
      };
      
      // Cache the result briefly
      transactionCache.set(txHash, {
        status: 'PENDING',
        timestamp: Date.now()
      });
      
      return NextResponse.json(response);
    }
    
    // Cache the successful result (keep longer)
    transactionCache.set(txHash, {
      status: txResult.status,
      details: {
        ledger: txResult.ledger,
        createdAt: txResult.createdAt,
        applicationOrder: txResult.applicationOrder
      },
      timestamp: Date.now()
    });
    
    // Return the transaction status
    return NextResponse.json({
      success: true,
      status: txResult.status,
      details: {
        ledger: txResult.ledger,
        createdAt: txResult.createdAt,
        applicationOrder: txResult.applicationOrder
      }
    });
  } catch (error) {
    console.error('Error checking transaction status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: parseContractError(error)
      },
      { status: 500 }
    );
  }
}
