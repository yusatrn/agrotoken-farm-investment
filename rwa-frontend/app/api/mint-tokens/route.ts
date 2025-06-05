// API route for automatic token minting
// This runs with server-side credentials and can mint tokens as the contract admin

import { NextRequest, NextResponse } from 'next/server';
import {
  Keypair,
  TransactionBuilder,
  BASE_FEE,
  Networks,
  Contract,
  Address,
  nativeToScVal,
  rpc,
  Account
} from '@stellar/stellar-sdk';
import { RWA_CONTRACT_ID } from '../../../lib/stellar';
import { parseContractError } from '../../../lib/stellar';

// Read admin key securely from environment variables
// IMPORTANT: NEVER expose this in client-side code!
const ADMIN_SECRET_KEY = process.env.CONTRACT_ADMIN_SECRET_KEY; 
const ADMIN_PUBLIC_KEY = process.env.CONTRACT_ADMIN_PUBLIC_KEY;
const NETWORK = process.env.STELLAR_NETWORK || 'testnet';

// Track minting operations to prevent duplicates
const mintingOperations = new Map<string, {
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  hash?: string;
  error?: string;
}>();

// Helper to get network passphrase
function getNetworkPassphrase(): string {
  return NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
}

// Helper to get Soroban RPC server URL
function getServerUrl(): string {
  return NETWORK === 'mainnet' 
    ? 'https://mainnet.sorobanrpc.com' 
    : 'https://soroban-testnet.stellar.org';
}

// Helper to check RPC health
async function checkRpcHealth(server: rpc.Server): Promise<boolean> {
  try {
    const health = await server.getHealth();
    console.log('✅ RPC health check passed:', health);
    return true;
  } catch (error) {
    console.error('❌ RPC health check failed:', error);
    return false;
  }
}

// Server-side token minting function that uses admin credentials
async function mintTokensAsAdmin(
  destinationAddress: string,
  amount: string
): Promise<{ success: boolean; hash?: string; error?: string }> {
  console.log(`🔐 Server-side mint for ${destinationAddress}, amount: ${amount}`);
  
  if (!ADMIN_SECRET_KEY || !ADMIN_PUBLIC_KEY) {
    console.error('❌ Admin credentials not configured');
    return { 
      success: false, 
      error: 'Server not configured for automatic minting' 
    };
  }
  
  try {
    // Initialize RPC server connection
    const serverUrl = getServerUrl();
    const server = new rpc.Server(serverUrl, {
      allowHttp: false,
      timeout: 60000, // 60s timeout
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Check RPC health
    const isHealthy = await checkRpcHealth(server);
    if (!isHealthy) {
      return { 
        success: false, 
        error: 'Blockchain RPC server unavailable' 
      };
    }
    
    // Load the admin account - this is server-side code, so we can use the admin keypair
    const adminKeypair = Keypair.fromSecret(ADMIN_SECRET_KEY);
    let adminAccount: Account;
    
    try {
      // Get account from network
      const accountResponse = await server.getAccount(ADMIN_PUBLIC_KEY);
      adminAccount = accountResponse;
    } catch (error) {
      console.error(`❌ Failed to fetch admin account:`, error);
      return {
        success: false,
        error: 'Admin account not found or not funded'
      };
    }
    
    // Create contract instance
    const contract = new Contract(RWA_CONTRACT_ID);
    
    // Prepare contract arguments
    const args = [
      Address.fromString(destinationAddress).toScVal(),
      nativeToScVal(BigInt(amount), { type: 'i128' })
    ];
    
    // Build the transaction with admin account
    const transaction = new TransactionBuilder(adminAccount, {
      fee: BASE_FEE,
      networkPassphrase: getNetworkPassphrase(),
    })
      .addOperation(contract.call('mint_simple', ...args))
      .setTimeout(300)
      .build();
    
    // Simulate the transaction first to ensure it will succeed
    console.log('Simulating mint transaction...');
    const simulationResult = await server.simulateTransaction(transaction);
    if (rpc.Api.isSimulationError(simulationResult)) {
      const errorMsg = `Simulation failed: ${simulationResult.error}`;
      console.error(errorMsg);
      return { 
        success: false, 
        error: errorMsg
      };
    }
    
    // Prepare and sign the transaction with admin key
    const preparedTransaction = rpc.assembleTransaction(
      transaction,
      simulationResult
    ).build();
    
    preparedTransaction.sign(adminKeypair);
    
    // Submit the transaction to the network
    console.log('Submitting mint transaction to network...');
    const result = await server.sendTransaction(preparedTransaction);
    
    if (result.status === 'ERROR') {
      console.error('Transaction error details:', result);
      return { 
        success: false, 
        error: `Transaction failed: ${result.errorResult || 'Unknown error'}` 
      };
    }
    
    const resultHash = result.hash;
    console.log(`⏳ Mint transaction submitted with hash ${resultHash}`);
    
    // Check transaction result (with timeout)
    let transactionSucceeded = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      try {
        console.log(`Checking transaction status (attempt ${attempts + 1}/${maxAttempts})...`);
        const txResult = await server.getTransaction(resultHash);
        
        if (txResult.status === 'SUCCESS') {
          console.log(`✅ Mint transaction successful:`, resultHash);
          transactionSucceeded = true;
          break;
        } else if (txResult.status === 'FAILED') {
          return { 
            success: false, 
            error: `Transaction failed: ${txResult.resultXdr}` 
          };
        }
      } catch (error) {
        // Transaction not found yet, continue waiting
      }
      
      // Wait before checking again (increasing delay)
      const delay = 1000 * (attempts + 1); // Progressive backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      attempts++;
    }
    
    // Return success status and hash
    if (transactionSucceeded) {
      return { success: true, hash: resultHash };
    } else {
      // Transaction might still be processing
      return { 
        success: true, 
        hash: resultHash,
        error: 'Transaction submitted but confirmation taking longer than expected'
      };
    }
  } catch (error) {
    console.error('Error in admin minting:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
}

// API route handler
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Parse the request body
    const body = await request.json();
    const { destinationAddress, amount, source, requestId } = body;
    
    // Validate required fields
    if (!destinationAddress || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create unique identifier for this minting operation
    const operationId = requestId || `${destinationAddress}-${amount}-${Date.now()}`;
    
    // Check if this operation is already being processed
    const existingOperation = mintingOperations.get(operationId);
    if (existingOperation) {
      if (existingOperation.status === 'completed') {
        return NextResponse.json({
          success: true,
          message: 'Tokens already minted',
          transactionHash: existingOperation.hash,
          operationId
        });
      } else if (existingOperation.status === 'pending' && 
                 Date.now() - existingOperation.timestamp < 3 * 60 * 1000) { // 3 minutes timeout
        return NextResponse.json({
          success: true,
          message: 'Minting operation in progress',
          operationId
        });
      }
    }
    
    // Record that we're starting this operation
    mintingOperations.set(operationId, {
      status: 'pending',
      timestamp: Date.now()
    });
    
    // Log the minting request
    console.log(`📝 Token mint requested: ${amount} tokens to ${destinationAddress} (source: ${source || 'unknown'})`);
    
    // Execute minting operation
    const result = await mintTokensAsAdmin(destinationAddress, amount);
    
    // Update operation status
    if (result.success) {
      mintingOperations.set(operationId, {
        status: 'completed',
        timestamp: Date.now(),
        hash: result.hash
      });
      
      return NextResponse.json({
        success: true,
        message: 'Tokens minted successfully',
        transactionHash: result.hash,
        operationId
      });
    } else {
      mintingOperations.set(operationId, {
        status: 'failed',
        timestamp: Date.now(),
        error: result.error
      });
      
      return NextResponse.json({
        success: false,
        error: result.error || 'Unknown error during minting',
        operationId
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing token minting request:', error);
    return NextResponse.json(
      { success: false, error: 'Server error processing request' },
      { status: 500 }
    );
  }
}
