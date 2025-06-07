// Test transfer functionality to debug UnreachableCodeReached error
const { Contract, Keypair, TransactionBuilder, BASE_FEE, Networks, Account, Address, nativeToScVal, rpc } = require('@stellar/stellar-sdk');

// Contract ID and RPC setup
const contractId = 'CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX';
const server = new rpc.Server('https://soroban-testnet.stellar.org', {
    allowHttp: false,
    timeout: 60000,
});

// Test addresses
const aliceAddress = 'GDZKP7RKYHNHIKOOOQ4WMZLYGKNMU5OWTNG2RNZOWLQE7KGF5TQBTJM4';
const bobAddress = 'GCQMVFGAABCTX4TFA65BQTJJ5ZRSPN5ROU5R2L2ZDGVHZ4E7QSG6XXTF';

async function testTransferDebug() {
    try {
        console.log('🧪 Testing transfer functionality...');
        console.log(`Contract ID: ${contractId}`);
        console.log(`From: ${aliceAddress}`);
        console.log(`To: ${bobAddress}`);
        
        // Create contract and source account
        const contract = new Contract(contractId);
        const sourceKeypair = Keypair.random();
        const sourceAccount = new Account(sourceKeypair.publicKey(), '0');
        
        console.log('📝 Created contract and source account');
        
        // First, check balances
        console.log('\n🔍 Checking balances...');
        
        // Alice balance
        const aliceBalanceTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(
            contract.call('balance', Address.fromString(aliceAddress).toScVal())
        )
        .setTimeout(300)
        .build();
        
        const aliceBalanceResult = await server.simulateTransaction(aliceBalanceTransaction);
        console.log('📊 Alice balance simulation:', aliceBalanceResult);
        
        if (rpc.Api.isSimulationSuccess(aliceBalanceResult) && aliceBalanceResult.result?.retval) {
            const balance = aliceBalanceResult.result.retval;
            console.log('✅ Alice balance retrieved');
        } else {
            console.log('❌ Alice balance simulation failed');
        }
        
        // Bob balance
        const bobBalanceTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(
            contract.call('balance', Address.fromString(bobAddress).toScVal())
        )
        .setTimeout(300)
        .build();
        
        const bobBalanceResult = await server.simulateTransaction(bobBalanceTransaction);
        console.log('📊 Bob balance simulation:', bobBalanceResult);
        
        // Now test transfer simulation
        console.log('\n🔄 Testing transfer simulation...');
        
        const transferAmount = BigInt(100); // Transfer 100 tokens
        const transferTransaction = new TransactionBuilder(sourceAccount, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET,
        })
        .addOperation(
            contract.call('transfer', 
                Address.fromString(aliceAddress).toScVal(),
                Address.fromString(bobAddress).toScVal(),
                nativeToScVal(transferAmount, { type: 'i128' })
            )
        )
        .setTimeout(300)
        .build();
        
        console.log('🚀 Simulating transfer transaction...');
        const transferResult = await server.simulateTransaction(transferTransaction);
        
        console.log('📊 Transfer simulation result:', transferResult);
        
        if (rpc.Api.isSimulationSuccess(transferResult)) {
            console.log('✅ Transfer simulation successful');
        } else if (rpc.Api.isSimulationError(transferResult)) {
            console.log('❌ Transfer simulation failed with error:', transferResult.error);
        } else {
            console.log('❓ Transfer simulation returned unexpected result');
        }
        
    } catch (error) {
        console.error('💥 Error during transfer test:', error);
        if (error.response) {
            console.error('Response error:', error.response.data);
        }
        return null;
    }
}

// Run the test
testTransferDebug().then(() => {
    console.log('\n🏁 Transfer debug test completed');
}).catch(error => {
    console.error('💥 Test failed:', error);
});
