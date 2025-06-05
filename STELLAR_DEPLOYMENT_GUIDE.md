# Stellar Soroban Contract Deployment Guide

## Prerequisites

### 1. Install Rust
First, you need to install Rust on your Windows system:

```powershell
# Download and run rustup-init.exe from https://rustup.rs/
# Or use chocolatey if available:
choco install rust

# After installation, restart your terminal and verify:
rustc --version
cargo --version
```

### 2. Install Soroban CLI
```bash
cargo install --locked soroban-cli
```

### 3. Add WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

## Deployment Steps

### 1. Create Stellar Account
```bash
# Generate a new keypair named 'alice'
soroban keys generate alice

# View the public key
soroban keys address alice
```

### 2. Configure Testnet
```bash
# Add testnet configuration
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Use testnet as default
soroban network use testnet
```

### 3. Fund Account with Test XLM
```bash
# Get free testnet XLM
soroban keys fund alice --network testnet
```

### 4. Build the Contract
```bash
# Navigate to project directory
cd c:\projeler\agrotoken-farm-investment

# Build the contract for WASM
cargo build --target wasm32-unknown-unknown --release
```

### 5. Deploy to Testnet
```bash
# Deploy the contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/agrotoken_farm_investment.wasm \
  --source alice \
  --network testnet
```

**Important:** Save the CONTRACT_ID that's returned after deployment!

### 6. Get Your Secret Key (for frontend integration)
```bash
# Show the secret key for alice account
soroban keys show alice
```

## Frontend Integration

After successful deployment, update your frontend configuration:

### Update Contract ID
1. Open `rwa-frontend/lib/stellar.ts`
2. Replace the `RWA_CONTRACT_ID` with your deployed contract ID:

```typescript
export const RWA_CONTRACT_ID = 'YOUR_NEW_CONTRACT_ID_HERE';
```

### Configure Network
Make sure your frontend is using testnet:
```typescript
export const DEFAULT_NETWORK: 'testnet' | 'mainnet' = 'testnet';
```

## Verification

### 1. Check Deployment Status
Visit the Stellar Testnet Explorer:
- https://stellar.expert/explorer/testnet
- Search for your contract ID

### 2. Test Contract Functions
```bash
# Test a read function (example: get total supply)
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source alice \
  --network testnet \
  -- total_supply
```

## Troubleshooting

### Common Issues:

1. **Build Errors**: Make sure you have the correct Rust version and WASM target
2. **Network Errors**: Verify testnet configuration and account funding
3. **Deploy Errors**: Check account has sufficient XLM balance

### Contract Functions to Test:
- `total_supply`: Get total token supply
- `balance`: Get balance for an address
- `is_whitelisted`: Check if address is whitelisted
- `get_asset_metadata`: Get asset information

## Next Steps

1. **Initialize Contract**: After deployment, you may need to initialize the contract with metadata
2. **Set Admin**: Configure admin permissions
3. **Whitelist Addresses**: Add addresses to whitelist for testing
4. **Frontend Testing**: Test all functions through your React frontend

## Environment Variables

For production deployment, consider using environment variables:

```bash
# .env.local in rwa-frontend/
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=YOUR_CONTRACT_ID
NEXT_PUBLIC_ADMIN_SECRET=YOUR_ADMIN_SECRET_KEY
```

## Security Notes

- Never share your secret keys
- Use different accounts for testing and production
- Keep your contract ID secure but accessible to your frontend
- Consider using separate admin keys for contract management

## Useful Commands

```bash
# List all networks
soroban network ls

# List all keys
soroban keys ls

# Get account info
soroban keys address alice

# Check account balance
soroban keys fund alice --network testnet

# Remove a key (be careful!)
soroban keys rm alice
```
