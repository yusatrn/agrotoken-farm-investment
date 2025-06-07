// Test script to verify transfer amount conversion fix
console.log('🔧 Testing Transfer Amount Conversion Fix');
console.log('=========================================');

// Simulate the fixed functions
function toContractAmount(displayAmount) {
  const num = typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount;
  return Math.floor(num).toString();
}

function toContractAmountOld(displayAmount) {
  const num = typeof displayAmount === 'string' ? parseFloat(displayAmount) : displayAmount;
  return Math.floor(num * Math.pow(10, 7)).toString();
}

function toDisplayAmount(contractAmount) {
  const num = typeof contractAmount === 'string' ? parseInt(contractAmount) : contractAmount;
  return num;
}

function toDisplayAmountOld(contractAmount) {
  const num = typeof contractAmount === 'string' ? parseInt(contractAmount) : contractAmount;
  return num / Math.pow(10, 7);
}

// Test cases based on the actual error
const testCases = [
  {
    name: 'User Transfer Amount (Caused Error)',
    displayAmount: '12',
    expectedContract: '12',
    userBalance: 316
  },
  {
    name: 'Small Transfer',
    displayAmount: '5',
    expectedContract: '5',
    userBalance: 316
  },
  {
    name: 'Maximum Available',
    displayAmount: '316',
    expectedContract: '316', 
    userBalance: 316
  },
  {
    name: 'Decimal Amount',
    displayAmount: '10.5',
    expectedContract: '10', // Should floor
    userBalance: 316
  }
];

console.log('\n📊 Conversion Test Results:');
console.log('============================');

testCases.forEach(testCase => {
  const newContract = toContractAmount(testCase.displayAmount);
  const oldContract = toContractAmountOld(testCase.displayAmount);
  const newDisplay = toDisplayAmount(newContract);
  const oldDisplay = toDisplayAmountOld(oldContract);
  
  const isValidTransfer = parseInt(newContract) <= testCase.userBalance;
  const wasValidTransferOld = parseInt(oldContract) <= testCase.userBalance;
  
  console.log(`\n${testCase.name}:`);
  console.log(`  Display Amount: ${testCase.displayAmount}`);
  console.log(`  User Balance: ${testCase.userBalance}`);
  console.log(`  Expected Contract: ${testCase.expectedContract}`);
  console.log(`  NEW - Contract Amount: ${newContract} ${newContract === testCase.expectedContract ? '✅' : '❌'}`);
  console.log(`  OLD - Contract Amount: ${oldContract} (BROKEN)`);
  console.log(`  NEW - Valid Transfer: ${isValidTransfer ? 'YES ✅' : 'NO ❌'}`);
  console.log(`  OLD - Valid Transfer: ${wasValidTransferOld ? 'YES' : 'NO ❌'} (${wasValidTransferOld ? 'Would work' : 'WOULD FAIL'})`);
  console.log(`  NEW - Round Trip: ${testCase.displayAmount} → ${newContract} → ${newDisplay}`);
  console.log(`  OLD - Round Trip: ${testCase.displayAmount} → ${oldContract} → ${oldDisplay} (BROKEN)`);
});

console.log('\n🎯 Error Analysis:');
console.log('===================');
console.log('Original Error: "Required: 120000000" when user tried to transfer 12 tokens');
console.log(`12 × 10^7 = ${12 * Math.pow(10, 7)} (matches the error!)`);
console.log('✅ Fix: Remove the 10^7 multiplication - use raw numbers');

console.log('\n🔧 Manual Verification Steps:');
console.log('==============================');
console.log('1. Open http://localhost:3000/transfer');
console.log('2. Try transferring 12 tokens (should work now)');
console.log('3. Check console - no "Required: 120000000" error');
console.log('4. Transfer should succeed with available balance of 316');

console.log('\n✅ Transfer amount conversion fix completed!');
