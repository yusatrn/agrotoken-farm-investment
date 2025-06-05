# AgroToken Farm Investment - Usage Guide

## Quick Start Scripts

### 1. Whitelist a User
```powershell
.\whitelist-user.ps1 -UserAddress "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

### 2. Mint Tokens for Investment
```powershell
.\mint-tokens.ps1 -UserAddress "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" -TokenAmount "10"
```

## Contract Information
- **Contract ID:** `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Network:** Stellar Testnet
- **Admin Identity:** `alice`

## Investment Process
1. User makes XLM payment through the frontend
2. Admin runs whitelist script to approve the user's address
3. Admin runs mint script to create AGRO tokens (1:1 ratio with XLM investment)
4. User receives farm tokens in their wallet

## Recent Successful Transaction
- **User Address:** `GB2KABJBR4ILQVF7L23N67KFOBHN52WBMJRMCALPALMVFY3HWADRSAGZ`
- **Investment:** 10 XLM → 10 AGRO tokens (initial)
- **Additional Minting:** +3 AGRO tokens (testing)
- **Current Balance:** 13 AGRO tokens
- **Status:** ✅ COMPLETED

## Files Overview
- `whitelist-user.ps1` - Add users to contract whitelist
- `mint-tokens.ps1` - Mint AGRO tokens for investments
- `deploy-contract-clean.ps1` - Deploy contract (admin use)
- `verify-deployment.ps1` - Verify contract deployment
- `test-contract.ps1` - Test contract functionality
- `rwa-frontend/` - Web application for user interactions

## Requirements
- Stellar CLI installed
- PowerShell execution policy set to allow scripts
- Access to `alice` identity (contract admin)
