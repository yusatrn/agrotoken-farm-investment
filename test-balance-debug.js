// Manual test for balance debugging
// Run this in browser console to test balance fetch

async function testBalanceDebug() {
    console.log('🔍 Starting balance debug test...');
    
    const contractId = 'CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX';
    const bobAddress = 'GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ';
    
    console.log('📊 Test parameters:', { contractId, bobAddress });
    
    try {
        // Import Stellar SDK (assumes it's loaded)
        const { Contract, Keypair, Account, TransactionBuilder, BASE_FEE, Networks, rpc, Address, scValToNative } = StellarSdk;
        
        console.log('✅ Stellar SDK loaded');
        
        // Create RPC server
        const server = new rpc.Server('https://soroban-testnet.stellar.org', {
            allowHttp: false,
            timeout: 60000,
            headers: { 'Content-Type': 'application/json' }
        });
        
        console.log('🌐 RPC server created');
        
        // Test RPC health
        const health = await server.getHealth();
        console.log('✅ RPC Health:', health);
        
        // Create contract and source account
        const contract = new Contract(contractId);
        const sourceKeypair = Keypair.random();
        const sourceAccount = new Account(sourceKeypair.publicKey(), '0');
        
        console.log('📝 Created contract and source account');
        
        // Build transaction
        const transaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(
            contract.call('balance', Address.fromString(bobAddress).toScVal())
        )
        .setTimeout(300)
        .build();
        
        console.log('🚀 Built transaction, simulating...');
        
        // Simulate transaction
        const simulationResult = await server.simulateTransaction(transaction);
        
        console.log('📊 Simulation result:', simulationResult);
        
        if (rpc.Api.isSimulationSuccess(simulationResult) && simulationResult.result?.retval) {
            const balance = scValToNative(simulationResult.result.retval);
            console.log('✅ Balance retrieved successfully:', balance);
            return balance.toString();
        } else {
            console.log('❌ Simulation failed or no retval');
            return '0';
        }
        
    } catch (error) {
        console.error('💥 Error during balance test:', error);
        return null;
    }
}

// Run the test
console.log('🧪 Testing balance retrieval and formatting for Bob...');

// Test Bob's balance formatting
console.log('Test addresses:');
console.log('Bob: GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ');

// Simulate the contract balance response and formatting
const bobAddress = 'GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ';
const rawBalance = '304'; // What contract returns

// Old formatTokenAmount (with 7 decimals)
function oldFormatTokenAmount(amount, decimals = 7) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = (num / Math.pow(10, decimals)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatted;
}

// New formatTokenAmount (no decimals)
function newFormatTokenAmount(amount, decimals = 0) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const formatted = (decimals > 0 ? num / Math.pow(10, decimals) : num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatted;
}

console.log('\n📊 Balance Display Comparison:');
console.log(`Raw balance from contract: ${rawBalance}`);
console.log(`Old display: "${oldFormatTokenAmount(rawBalance)} GVOF"`);
console.log(`New display: "${newFormatTokenAmount(rawBalance)} AGRO"`);

console.log('\n✅ The fix should show "304 AGRO" instead of "0 GVOF"!');

// Function definition for manual testing (not executed automatically)
function testBalanceDebug() {
  console.log('🔍 Manual balance debug function available but not executed automatically');
}
