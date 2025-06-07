# Automatic Token Minting Feature

The AgroToken Farm Investment platform includes an automatic token minting system that handles token issuance when users make investments.

## Overview

When a user makes an investment in a farm token package, the system automatically mints the corresponding tokens to their wallet using a multi-layered approach:

1. **Server-side API Minting (Primary)**: Uses admin credentials to mint tokens on behalf of users
2. **Direct User Wallet Minting (Secondary)**: Fallback for users with admin privileges
3. **Background Queue Minting (Fallback)**: Queues minting operations for later processing

## Configuration

To enable automatic token minting, administrators need to configure the following:

### 1. Environment Variables

Create or update `.env.local` in the frontend project with:

```
# Contract Admin Credentials
CONTRACT_ADMIN_PUBLIC_KEY=YOUR_ADMIN_PUBLIC_KEY
CONTRACT_ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY

# Stellar network configuration ('testnet' or 'mainnet')
STELLAR_NETWORK=testnet

# Base URL for Next.js app
NEXT_PUBLIC_BASE_URL=https://your-app-domain.com

# Internal API security
INTERNAL_API_KEY=your_secure_internal_api_key_here
```

### 2. Verify Configuration

Run the verification script to check if everything is set up correctly:

```powershell
.\check-auto-minting.ps1
```

## API Endpoints

The system uses the following API endpoints:

- **/api/mint-tokens**: Primary endpoint for minting tokens using admin credentials
- **/api/queue-mint**: Background queue for processing mint operations
- **/api/check-transaction**: Check transaction status
- **/api/check-admin**: Verify if a wallet is an admin

## Admin Dashboard

Administrators can monitor and manage minting operations through the admin dashboard:

- URL: `/admin-dashboard`
- Features:
  - View pending minting operations
  - Process tokens manually if needed
  - Check transaction status

## Security Considerations

- Admin credentials are stored securely and used only server-side
- API endpoints have appropriate access controls
- Background process uses internal authentication

## User Experience

The investment flow provides users with:

1. Clear feedback on transaction status
2. Transaction hash for tracking
3. Automatic portfolio updates when tokens are received

## Troubleshooting

If automatic minting fails:

1. Check the admin dashboard for pending operations
2. Verify that the admin account has sufficient XLM for gas fees
3. Check that the admin has the correct privileges on the contract
4. Use the admin scripts in the root directory for manual intervention if needed

For more detailed information, see the [AUTO_MINTING_CONFIG.md](./AUTO_MINTING_CONFIG.md) guide.
