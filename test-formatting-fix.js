// Test script to verify the balance formatting fix
console.log('🧪 Testing formatTokenAmount function...');

// Simulate the formatTokenAmount function behavior
function formatTokenAmount(amount, decimals = 0) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  // Our contract stores raw numbers without decimal scaling, so no division needed
  const formatted = (decimals > 0 ? num / Math.pow(10, decimals) : num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return formatted;
}

// Test cases
console.log('Test 1 - Bob\'s actual balance (304):');
console.log('  Raw: 304');
console.log('  Old way (divided by 10^7):', (304 / Math.pow(10, 7)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
console.log('  New way (no division):', formatTokenAmount(304));

console.log('\nTest 2 - Alice\'s balance (large number):');
const aliceBalance = 2000000000;
console.log('  Raw:', aliceBalance);
console.log('  Old way (divided by 10^7):', (aliceBalance / Math.pow(10, 7)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
console.log('  New way (no division):', formatTokenAmount(aliceBalance));

console.log('\nTest 3 - String input (as from contract):');
console.log('  Raw: "304"');
console.log('  New way:', formatTokenAmount("304"));

console.log('\n✅ Formatting tests complete!');
console.log('Expected: Bob should now see "304 AGRO" instead of "0 GVOF"');
