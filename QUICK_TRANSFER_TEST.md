# 🧪 TRANSFER TESTING GUIDE

## QUICK TEST STEPS

### Step 1: Check Current Status
1. Go to **http://localhost:3001/transfer**
2. Connect your Freighter wallet
3. Look at the "Max:" button - it shows your current balance

### Step 2A: If Balance is 0 (Most Likely)
```
Max: 0 AGRO
```
**Action Required:**
1. Go to **http://localhost:3001/admin-dashboard**
2. Mint tokens to your wallet address:
   - Address: GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ
   - Amount: 100 (or any amount > 12)
3. Return to transfer page
4. Refresh to see updated balance

### Step 2B: If Balance > 0
```
Max: 100 AGRO (or whatever amount)
```
**You're ready to test transfer!**

### Step 3: Test Transfer
1. Enter recipient address: `GB2KABJBR4ILQVF7L23N67KFOBHN52WBMJRMCALPALMVFY3HWADRSAGZ`
2. Enter amount: `12` (or less than your balance)
3. Click "Transfer Tokens"
4. **Expected**: Success! ✅

## 🔍 ERROR SCENARIOS TO TEST

### Test 1: Zero Balance Error
- Try transfer with 0 balance
- **Expected**: "You have no tokens to transfer. Please acquire tokens first."

### Test 2: Insufficient Balance Error  
- If you have 5 AGRO, try to transfer 10 AGRO
- **Expected**: "Insufficient balance. You have 5 AGRO but trying to transfer 10 AGRO."

### Test 3: Invalid Address Error
- Enter invalid recipient address
- **Expected**: "Invalid Stellar address format"

## ✅ SUCCESS INDICATORS
- ✅ Transfer completed successfully!
- ✅ Balance updated after transfer
- ✅ No "UnreachableCodeReached" errors
- ✅ Clear, helpful error messages when applicable

---
**Ready to test? Start at http://localhost:3001/transfer** 🚀
