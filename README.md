# 🌾 AgroToken Farm Investment Platform

A comprehensive agricultural asset tokenization and investment platform built on the Stellar blockchain. This platform enables farmers to tokenize their agricultural assets and allows investors to participate in sustainable farming through blockchain technology.

![AgroToken Platform](https://img.shields.io/badge/Platform-AgroToken_Farm_Investment-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-brightgreen)
![Framework](https://img.shields.io/badge/Framework-Next.js_15-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 **Project Overview**

The AgroToken Farm Investment Platform democratizes access to agricultural investments by tokenizing farm assets on the Stellar blockchain. Farmers can access funding without selling their land, while investors can purchase fractional ownership of agricultural assets like organic farms, dairy operations, livestock ranches, and food processing facilities.

### **🌟 Key Features**

#### **For Farmers**
- 🚜 **Farm Tokenization** - Transform agricultural assets into tradeable farm shares
- 💰 **Access to Capital** - Raise funding while retaining farm ownership
- 📋 **Compliance Management** - Organic certification and agricultural compliance tools
- 🌱 **Sustainable Focus** - Support for organic and sustainable farming practices

#### **For Investors**
- 💼 **Farm Portfolio Dashboard** - Overview of agricultural investments with real-time valuations
- 🏪 **Agricultural Marketplace** - Discover and filter farm investment opportunities  
- 💸 **Secure Share Transfers** - Send/receive farm shares with compliance validation
- 📊 **Performance Tracking** - Monitor yields, organic certification status, and harvest projections
- 🔐 **Wallet Integration** - Seamless Freighter wallet connectivity

#### **For Asset Owners (Farmers)**
- 🌱 **Farm Listing Wizard** - 5-step process to tokenize agricultural assets
- 📋 **Agricultural Compliance** - Organic certification and regulatory compliance tools
- 📈 **Funding Management** - Set investment goals and track capital raising
- 🔒 **Legal Framework** - Land ownership verification and legal compliance

#### **Platform Features**
- 🌾 **Multi-Farm Support** - Cropland, livestock, dairy farms, food processing
- ⚡ **Stellar Integration** - Fast, low-cost blockchain transactions
- 🛡️ **Organic Compliance** - Built-in organic certification and investor validation
- 📱 **Responsive Design** - Professional UI optimized for agricultural investments

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ installed
- [Freighter Wallet](https://freighter.app/) browser extension
- Access to Stellar Testnet for development

### **Installation**

```bash
# Clone the repository
git clone https://github.com/[YOUR_USERNAME]/agrotoken-farm-investment.git
cd agrotoken-farm-investment

# Navigate to frontend directory
cd rwa-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the AgroToken platform.

### **Production Build**

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🏗️ **Project Architecture**

### **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + TypeScript | React-based web application |
| **Styling** | Tailwind CSS + shadcn/ui | Professional UI components |
| **State Management** | Zustand | Lightweight state management |
| **Blockchain** | Stellar SDK | Blockchain integration |
| **Wallet** | Freighter API | Wallet connectivity |
| **Icons** | Lucide React | Professional icon system |

### **Directory Structure**

```
rwa-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Dashboard (main page)
│   ├── marketplace/       # Asset marketplace
│   ├── tokenize/          # Asset tokenization wizard
│   ├── transfer/          # Token transfer interface
│   ├── dashboard/         # Dashboard redirect
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── lib/
│   ├── types.ts           # TypeScript definitions
│   ├── stellar.ts         # Stellar SDK utilities
│   ├── contract.ts        # Smart contract client
│   └── utils.ts           # Helper functions
├── stores/
│   ├── wallet.ts          # Wallet state management
│   └── contract.ts        # Contract state management
└── public/                # Static assets
```

---

## 💼 **Smart Contract Integration**

### **Contract Details**
- **Contract ID**: `CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6`
- **Network**: Stellar Testnet
- **Asset**: Luxury Apartment NYC (LAPT)
- **Type**: Premium Manhattan real estate token

### **Supported Operations**

| Operation | Description | Status |
|-----------|-------------|--------|
| `get_balance` | Query user's token balance | ✅ Implemented |
| `get_metadata` | Retrieve asset information | ✅ Implemented |
| `transfer` | Send tokens between addresses | ✅ Implemented |
| `check_compliance` | Verify KYC/whitelist status | ✅ Implemented |
| `get_supply` | Get total token supply | ✅ Implemented |
| `mint` | Create new tokens (admin) | 🔄 Admin only |
| `pause` | Pause contract operations | 🔄 Admin only |

### **Asset Metadata Structure**

```typescript
interface AssetMetadata {
  name: string;              // "Luxury Apartment NYC"
  symbol: string;            // "LAPT"  
  asset_type: string;        // "real_estate"
  description: string;       // Asset description
  valuation: string;         // Current USD value
  last_valuation_date: number; // Unix timestamp
  legal_doc_hash: string;    // Property deed hash
}
```

---

## 📦 **Smart Contract Deployment**

### **Prerequisites for Deployment**
- Rust programming language ([Install Rust](https://rustup.rs/))
- Soroban CLI (`cargo install --locked soroban-cli`)
- WASM target (`rustup target add wasm32-unknown-unknown`)

### **Quick Deployment (Automated)**
```powershell
# Run the automated deployment script
.\deploy-contract.ps1

# Test your deployed contract
.\test-contract.ps1 -ContractId YOUR_CONTRACT_ID
```

### **Manual Deployment Steps**

1. **Generate Stellar Account**
```bash
soroban keys generate alice
soroban keys address alice
```

2. **Configure Testnet**
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

soroban network use testnet
```

3. **Fund Account**
```bash
soroban keys fund alice --network testnet
```

4. **Build Contract**
```bash
cargo build --target wasm32-unknown-unknown --release
```

5. **Deploy to Testnet**
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/agrotoken_farm_investment.wasm \
  --source alice \
  --network testnet
```

6. **Update Frontend Configuration**
After deployment, update the contract ID in `rwa-frontend/lib/stellar.ts`:
```typescript
export const RWA_CONTRACT_ID = 'YOUR_DEPLOYED_CONTRACT_ID';
```

### **Verification**
- Check deployment on [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet)
- View detailed deployment guide: `STELLAR_DEPLOYMENT_GUIDE.md`

---

## 🚀 **Current Deployment Status & Next Steps**

### **✅ Completed**
- ✅ Real contract client implementation (replaced mock system)
- ✅ Freighter wallet integration with real blockchain transactions
- ✅ Stellar SDK integration with proper RPC configuration
- ✅ Error handling and fallback systems for network issues
- ✅ Deployment scripts and documentation ready

### **🔄 Current Status: Ready for Contract Deployment**

The platform is now configured to use real Stellar blockchain transactions. The only step remaining is to deploy the Soroban smart contract to testnet and update the frontend configuration.

### **⚡ Quick Deployment Guide**

#### **Step 1: Check Prerequisites**
```powershell
# Check if Visual Studio Build Tools are installed
.\check-build-tools.ps1
```

#### **Step 2: Install Visual Studio Build Tools (if needed)**
If the check shows missing build tools:
1. Download from: https://visualstudio.microsoft.com/downloads/
2. Select "Build Tools for Visual Studio 2022"
3. During installation, select:
   - ✅ **C++ build tools**
   - ✅ **Windows 10/11 SDK** 
   - ✅ **MSVC v143 compiler toolset**
4. Restart your terminal after installation

#### **Step 3: Deploy Contract to Stellar Testnet**
```powershell
# Run the simplified deployment script
.\deploy-contract-simple.ps1

# The script will:
# - Install Soroban CLI if needed
# - Generate Stellar keypair
# - Fund testnet account
# - Build and deploy contract
# - Save contract ID to CONTRACT_ID.txt
```

#### **Step 4: Update Frontend Configuration**
After successful deployment, the script will show you the contract ID. Update it in:

**File:** `rwa-frontend/lib/stellar.ts`
```typescript
// Replace this line:
export const RWA_CONTRACT_ID = 'CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6';

// With your deployed contract ID:
export const RWA_CONTRACT_ID = 'YOUR_DEPLOYED_CONTRACT_ID_HERE';
```

#### **Step 5: Test Real Transfers**
1. Start the frontend: `cd rwa-frontend && npm run dev`
2. Connect Freighter wallet
3. Switch to Stellar Testnet in Freighter
4. Navigate to Transfer page (`/transfer`)
5. Test sending farm tokens to another address

### **🔧 Troubleshooting**

#### **Build Tools Issues**
```powershell
# Error: linker `link.exe` not found
# Solution: Install Visual Studio Build Tools with C++ workload

# Check installation
.\check-build-tools.ps1

# Alternative: Use Visual Studio Community
# Install with "Desktop development with C++" workload
```

#### **Soroban CLI Issues**
```powershell
# Error: soroban command not found
# Solution: Install manually
cargo install --locked soroban-cli

# Add to PATH if needed
# C:\Users\{username}\.cargo\bin
```

#### **Contract Deployment Issues**
```powershell
# Error: RPC timeout or network issues
# Solution: Wait and retry, testnet can be slow

# Check contract status on Stellar Explorer:
# https://stellar.expert/explorer/testnet/contract/YOUR_CONTRACT_ID
```

### **📋 Development vs Production**

| Environment | Contract | Network | Purpose |
|-------------|----------|---------|---------|
| **Development** | Mock Client | Local | UI development and testing |
| **Testing** | Real Contract | Testnet | Integration testing |
| **Production** | Real Contract | Mainnet | Live application |

### **🎯 Next Steps After Deployment**

1. **✅ Contract Deployed** - Real Soroban contract on Stellar testnet
2. **🔄 Test Transfers** - Verify farm token transfers work end-to-end  
3. **🔄 Admin Functions** - Test minting, pausing, and administrative operations
4. **🔄 UI Polish** - Enhance transfer confirmations and error messages
5. **🔄 Production Deployment** - Deploy to mainnet for live use

### **💡 Alternative: Skip Contract Deployment**

If you want to test the UI without deploying:
- The platform includes a fallback system
- It will use `DevelopmentContractClient` if contract deployment fails
- All UI features work with simulated data
- Perfect for frontend development and testing

---

## 📞 **Support & Issues**

If you encounter issues during deployment:

1. **Check Prerequisites**: Run `.\check-build-tools.ps1`
2. **Review Logs**: Deployment script provides detailed error messages
3. **Try Manual Steps**: Follow `STELLAR_DEPLOYMENT_GUIDE.md` for step-by-step deployment
4. **Network Issues**: Stellar testnet can be slow, retry after a few minutes
5. **Open Issue**: Report problems with full error logs

**Contract Status**: Ready for deployment ✅  
**Frontend Status**: Configured for real transactions ✅  
**Prerequisites**: Visual Studio Build Tools required 🔧

---

## 🌱 **Vision & Impact**

AgroToken Farm Investment Platform bridges the gap between traditional agriculture and modern blockchain technology, enabling:

- **For Farmers**: Access to global capital while retaining farm ownership
- **For Investors**: Direct participation in sustainable agriculture with transparent returns
- **For the Industry**: Traceable supply chain and sustainable farming incentives

---

<div align="center">

**🌾 Built with ❤️ for the future of sustainable agriculture 🌾**

*"From farm to blockchain - Growing sustainable investments for tomorrow's agriculture"*

**[Live Demo](link) • [Documentation](link) • [Community](link) • [Contact](link)**

</div>

---

### 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### ⭐ **Support**

If you find this project helpful, please give it a star ⭐ on GitHub!