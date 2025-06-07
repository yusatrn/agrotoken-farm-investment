// Debug script to check contract state and identify the transfer issue
const { execSync } = require('child_process');

async function checkContractState() {
  console.log('🔍 Investigating the UnreachableCodeReached error...\n');
  
  // The error shows:
  console.log('ERROR DETAILS:');
  console.log('- Error: VM call trapped: UnreachableCodeReached');
  console.log('- Function: transfer');
  console.log('- From: GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ');
  console.log('- To: GB2KABJBR4ILQVF7L23N67KFOBHN52WBMJRMCALPALMVFY3HWADRSAGZ');
  console.log('- Amount: 12');
  console.log('');
  
  console.log('POSSIBLE CAUSES:');
  console.log('1. Contract not properly initialized');
  console.log('2. Storage access issue with BALANCES map');
  console.log('3. Insufficient balance causing panic');
  console.log('4. Address authentication issue');
  console.log('5. Map operations causing storage corruption');
  console.log('');
  
  console.log('ANALYSIS:');
  console.log('The simple contract transfer function has these steps:');
  console.log('1. from.require_auth() - Verify sender signature');
  console.log('2. Get BALANCES map from storage');
  console.log('3. Get from_balance from map');
  console.log('4. Check if from_balance >= amount');
  console.log('5. Update balances and save to storage');
  console.log('');
  
  console.log('The error likely occurs because:');
  console.log('- The contract storage might not be properly initialized');
  console.log('- The BALANCES map might be corrupt or not exist');
  console.log('- The sender might not have sufficient balance (only 0)');
  console.log('');
  
  console.log('SOLUTION:');
  console.log('1. Check if contract is initialized');
  console.log('2. Ensure sender has balance (mint tokens first)');
  console.log('3. Fix contract initialization if needed');
  console.log('4. Add better error handling in contract');
}

checkContractState().catch(console.error);
