# Token Minting Guide for Administrators

## Overview

This guide explains how to process token minting requests when automatic minting through the frontend fails due to authentication requirements.

## When Manual Minting is Required

Manual minting is required in the following scenarios:
1. The frontend reports "Payment successful but automatic token minting failed"
2. Log messages show "ADMIN ACTION REQUIRED: Mint X tokens to ADDRESS"
3. Authentication errors appear in the console logs

## Steps to Mint Tokens

### 1. Mint Tokens for Successful Payments

Use the PowerShell script with the user's wallet address and token amount:

```powershell
.\mint-tokens.ps1 -UserAddress "<USER_ADDRESS>" -TokenAmount "<TOKEN_AMOUNT>" -TransactionHash "<TRANSACTION_ID>"
```

Example:
```powershell
.\mint-tokens.ps1 -UserAddress "GB2KABJBR4ILQVF7L23N67KFOBHN52WBMJRMCALPALMVFY3HWADRSAGZ" -TokenAmount "100" -TransactionHash "8b83243da4a763dda5a55c731862c1453310b3baa4f546669d66cc1de6b70dbf"
```

### 2. Verify the Minting Operation

After running the script, verify:
- The minting was successful (script output)
- The user's new token balance matches the expected amount

### 3. Notify the User (Optional)

If you have contact information for the user, notify them that their tokens have been minted.

## Common Issues

### User Not Whitelisted

If you see "Error: User is not whitelisted!" when running the minting script:

1. Run the whitelist script first:
```powershell
.\whitelist-user.ps1 -UserAddress "<USER_ADDRESS>"
```

2. Then run the minting script again

### Insufficient Admin Permissions

Make sure you're using the correct admin identity ("alice") configured in the scripts.

## Need Help?

If you encounter any issues during the manual minting process, please check:
1. The contract ID in the script matches the deployed contract
2. The admin identity has the necessary permissions
3. The recipient address is valid and correctly formatted
