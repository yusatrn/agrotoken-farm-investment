# Configuring Automatic Token Minting

This guide explains how to set up the AgroToken automatic token minting system for your production environment.

## Overview

The AgroToken platform supports automatic token minting through a multi-layered approach:

1. **Server-side API Minting (Primary)**: Uses admin credentials to mint tokens on behalf of users
2. **Direct User Wallet Minting (Secondary)**: For users with admin privileges
3. **Background Queue Minting (Fallback)**: Queues minting operations for later processing

## Configuration

### 1. Set Up Admin Credentials

Edit the `.env.local` file with your contract admin credentials:

```
# Contract Admin Credentials
CONTRACT_ADMIN_PUBLIC_KEY=YOUR_ADMIN_PUBLIC_KEY
CONTRACT_ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY
```

**IMPORTANT**: Keep these credentials secure! Never commit them to version control.

### 2. Configure Network Settings

Set the correct Stellar network:

```
# Stellar network configuration ('testnet' or 'mainnet')
STELLAR_NETWORK=testnet
```

### 3. Set Your Base URL

Configure the base URL for your application:

```
NEXT_PUBLIC_BASE_URL=https://your-app-domain.com
```

### 4. Configure Internal API Security

Set a secure internal API key:

```
INTERNAL_API_KEY=your_secure_internal_api_key_here
```

## Running the System

1. Ensure the contract admin account has sufficient XLM for transaction fees
2. Verify the contract admin has minting privileges in the smart contract
3. Restart the server for new environment variables to take effect

## Testing Automatic Minting

1. Make an investment through the platform
2. The system will automatically attempt to mint tokens
3. Check the server logs to monitor the minting process
4. Verify tokens appear in the user's wallet

## Monitoring

- API endpoints provide status information:
  - GET `/api/queue-mint` shows the queue status
  - GET `/api/queue-mint?queueId=ID` shows status of a specific request

## Troubleshooting

If automatic token minting fails, check:

1. Admin credentials are correctly configured
2. The contract admin account has sufficient XLM
3. The contract admin has minting privileges
4. The user address is properly whitelisted
5. Server logs for specific error messages

## Manual Intervention

If automatic minting fails, you can use the `mint-tokens.ps1` script to manually mint tokens:

```powershell
./mint-tokens.ps1 -UserAddress G... -TokenAmount 100.00
```

## Security Considerations

- The admin secret key is only used server-side
- All API endpoints should be properly secured in production
- Consider using a dedicated admin account for minting operations
- Regularly rotate your internal API keys
