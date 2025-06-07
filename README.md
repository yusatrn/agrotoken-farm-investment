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

#### **New Features**
- ✨ **Automatic Token Minting** - Tokens are automatically minted to investors upon investment
- 🔄 **Multi-layered Minting Approach** - Server-side, user wallet, and background queue fallbacks
- 📊 **Transaction Status Monitoring** - Real-time status updates for token minting operations
- 🛡️ **Admin Dashboard** - Monitor and manage token minting operations

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
│   ├── invest/            # Investment page with auto-minting
│   ├── admin-dashboard/   # Admin monitoring and management
│   ├── api/               # API endpoints for auto-minting
│   │   ├── mint-tokens/   # Server-side token minting
│   │   ├── queue-mint/    # Background queue processing
│   │   ├── check-transaction/ # Transaction status monitoring
│   │   └── check-admin/   # Admin privilege verification
│   ├── dashboard/         # Dashboard redirect
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── lib/
│   ├── types.ts           # TypeScript definitions
│   ├── stellar.ts         # Stellar SDK utilities
│   ├── contract.ts        # Smart contract client with auto-minting
│   ├── payment.ts         # Payment processing with minting integration
│   └── utils.ts           # Helper functions
├── stores/
│   ├── wallet.ts          # Wallet state management
│   └── contract.ts        # Contract state management
└── public/                # Static assets
```

---

## 💼 **Smart Contract Integration**

### **Contract Details**
- **Contract ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Network**: Stellar Testnet
- **Asset**: AgroToken Farm Investment (AGRO)
- **Type**: Agricultural asset tokenization platform
- **Admin Public Key**: `GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO`

### **Supported Operations**

| Operation | Description | Status |
|-----------|-------------|--------|
| `get_balance` | Query user's token balance | ✅ Implemented |
| `get_metadata` | Retrieve asset information | ✅ Implemented |
| `transfer` | Send tokens between addresses | ✅ Implemented |
| `check_compliance` | Verify KYC/whitelist status | ✅ Implemented |
| `get_supply` | Get total token supply | ✅ Implemented |
| `mint_simple` | Create new tokens (automated) | ✅ Auto-minting |
| `mint` | Create new tokens (admin) | ✅ Implemented |
| `pause` | Pause contract operations | ✅ Admin only |

### **Asset Metadata Structure**

```typescript
interface AssetMetadata {
  name: string;              // "AgroToken Farm Investment"
  symbol: string;            // "AGRO"  
  asset_type: string;        // "agricultural"
  description: string;       // "Agricultural asset tokenization platform"
  valuation: string;         // Current USD value
  last_valuation_date: number; // Unix timestamp
  legal_doc_hash: string;    // Legal documentation hash
}
```

---

## 🤖 **Automatic Token Minting System**

The AgroToken platform features a sophisticated multi-layered automatic token minting system that eliminates the need for manual admin intervention when users make investments.

### **How It Works**

1. **Primary Path - Server-side API Minting**: Uses admin credentials to mint tokens automatically through `/api/mint-tokens`
2. **Secondary Path - Direct User Wallet**: For users with admin privileges, tokens are minted directly 
3. **Fallback Path - Background Queue**: Failed mints are queued for processing via `/api/queue-mint`

### **Configuration**

To enable automatic minting, administrators must configure the following in `.env.local`:

```bash
# Contract Admin Credentials
CONTRACT_ADMIN_PUBLIC_KEY=GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
CONTRACT_ADMIN_SECRET_KEY=YOUR_ADMIN_SECRET_KEY_HERE

# Stellar network configuration
STELLAR_NETWORK=testnet

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Internal API security
INTERNAL_API_KEY=your_secure_internal_api_key_here
```

### **Monitoring & Management**

- **Admin Dashboard**: Available at `/admin-dashboard` for monitoring minting operations
- **Transaction Status**: Real-time status updates for token minting operations
- **Error Handling**: Comprehensive error recovery and user feedback

### **Security Features**

- Admin credentials stored securely server-side only
- Multi-layer authentication for API endpoints
- Background processing with internal API security
- Transaction verification and status monitoring

---

## 🔗 **API Endpoints & Features**

The platform provides several API endpoints for automatic token minting and management:

### **Automatic Minting APIs**

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/mint-tokens` | POST | Server-side token minting with admin credentials | ✅ Active |
| `/api/queue-mint` | POST | Background queue processing for failed mints | ✅ Active |
| `/api/check-transaction` | GET | Monitor transaction status and confirmation | ✅ Active |
| `/api/check-admin` | GET | Verify if wallet has admin privileges | ✅ Active |

### **Usage Examples**

#### **Automatic Token Minting**
```typescript
// Investment flow automatically triggers minting
const response = await fetch('/api/mint-tokens', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destinationAddress: userWalletAddress,
    amount: tokenAmount,
    source: 'investment'
  })
});
```

#### **Transaction Status Monitoring**
```typescript
// Check transaction status
const status = await fetch(`/api/check-transaction?hash=${txHash}`);
const result = await status.json();
```

### **Key Platform Features**

#### **🤖 Intelligent Auto-Minting**
- **Primary**: Server-side minting using secure admin credentials
- **Secondary**: Direct user wallet minting for privileged users  
- **Fallback**: Background queue system for reliable processing
- **Monitoring**: Real-time status updates and transaction tracking

#### **👨‍💼 Admin Dashboard**
- **Operation Monitoring**: View pending and completed minting operations
- **Manual Intervention**: Process tokens manually when automatic systems fail
- **System Health**: Check RPC connectivity and system status
- **User Management**: Verify admin privileges and manage access

#### **🎯 Investment Experience**
- **Seamless Flow**: One-click investment with automatic token delivery
- **Real-time Feedback**: Transaction status updates and confirmations
- **Error Recovery**: Graceful handling of network or system issues
- **Portfolio Integration**: Automatic balance updates upon token receipt

#### **🛡️ Security & Compliance**
- **Whitelist Management**: Address-based access control
- **KYC Integration**: Compliance verification before transactions
- **Audit Trail**: Complete transaction history and logging
- **Secure Storage**: Admin credentials protected server-side only

---

## 📦 **Smart Contract - Deployed & Active**

### **✅ Deployment Status**
- **Status**: Successfully Deployed & Initialized
- **Date**: June 5, 2025
- **Network**: Stellar Testnet
- **Contract Explorer**: [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX)

### **📋 Contract Information**
- **Initial Supply**: 1,000,000,000 AGRO tokens
- **Current Valuation**: $1,000.00 
- **Legal Document Hash**: `QmYwAPJzv5CZsnA4qWkc2bGhJ2mGmbkVr8sxCTBCPLGSoL`
- **Contract Status**: Active (not paused)

### **🔧 Administrative Tools**

For administrators who need to interact with the contract directly:

```powershell
# Test contract functionality
.\test-contract.ps1 -ContractId CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX

# Verify automatic minting configuration
.\verify-auto-minting.ps1

# Manual token minting (if auto-minting fails)
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"

# Whitelist a new user address
.\whitelist-user.ps1 -UserAddress "G..."
```

### **📖 Additional Documentation**
- **Deployment Details**: See `DEPLOYMENT_COMPLETE.md`
- **Auto-Minting Setup**: See `AUTO_MINTING_CONFIG.md` 
- **Admin Guide**: See `ADMIN_MINT_GUIDE.md`
- **Usage Examples**: See `USAGE_GUIDE.md`

---

## 🚀 **Platform Status & Getting Started**

### **✅ Production Ready Features**
- ✅ **Smart Contract Deployed** - Live on Stellar Testnet with full functionality
- ✅ **Automatic Token Minting** - Multi-layered system with server-side, user wallet, and queue fallbacks
- ✅ **Real Blockchain Integration** - Freighter wallet integration with actual Stellar transactions
- ✅ **Admin Dashboard** - Complete monitoring and management interface
- ✅ **Investment Flow** - End-to-end investment process with automatic token delivery
- ✅ **Error Handling** - Comprehensive error recovery and user feedback
- ✅ **Transaction Monitoring** - Real-time status updates and transaction tracking

### **🎯 Quick Start Guide**

#### **For Users**
1. **Install Freighter Wallet**: Download from [freighter.app](https://freighter.app/)
2. **Switch to Testnet**: Configure Freighter for Stellar Testnet
3. **Fund Your Wallet**: Get testnet XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)
4. **Start Investing**: Visit the platform at `http://localhost:3000`

#### **For Developers**
```powershell
# Clone and setup the frontend
cd rwa-frontend
npm install
npm run dev

# The platform will be available at http://localhost:3000
```

#### **For Administrators**
```powershell
# Configure automatic minting (first time setup)
# 1. Edit .env.local with your admin credentials
# 2. Verify configuration
.\verify-auto-minting.ps1

# 3. Start the platform
cd rwa-frontend
npm run dev

# 4. Access admin dashboard at http://localhost:3000/admin-dashboard
```

### **🔧 Configuration**

#### **Environment Setup**
Create or update `.env.local` in the `rwa-frontend` directory:
```bash
# Admin credentials for automatic minting
CONTRACT_ADMIN_PUBLIC_KEY=GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
CONTRACT_ADMIN_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY_HERE

# Network configuration
STELLAR_NETWORK=testnet
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API security
INTERNAL_API_KEY=your_secure_api_key_here
```

### **🎮 Testing the Platform**

#### **Investment Flow Test**
1. Connect Freighter wallet (testnet)
2. Navigate to `/invest`
3. Select investment amount
4. Complete payment
5. Verify automatic token minting
6. Check your wallet balance

#### **Admin Functions Test**
1. Connect with admin wallet
2. Access `/admin-dashboard`
3. Monitor pending minting operations
4. Test manual minting if needed

### **📊 Platform Architecture**

| Component | Status | Purpose |
|-----------|--------|---------|
| **Smart Contract** | ✅ Deployed | Token management and compliance |
| **Frontend App** | ✅ Ready | User interface and wallet integration |
| **Auto-Minting APIs** | ✅ Active | Automatic token delivery system |
| **Admin Dashboard** | ✅ Available | Monitoring and management |
| **Error Recovery** | ✅ Implemented | Fallback systems and queue processing |

---

## 📞 **Support & Troubleshooting**

### **🔧 Common Issues & Solutions**

#### **Auto-Minting Issues**
```powershell
# Check auto-minting configuration
.\verify-auto-minting.ps1

# Test auto-minting endpoints
.\test-auto-minting.ps1

# Manual token minting if automatic fails
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"
```

#### **Wallet Connection Issues**
- Ensure Freighter wallet is installed and unlocked
- Switch to Stellar Testnet in Freighter settings
- Fund your testnet account with XLM

#### **Transaction Failures**
- Check network connectivity to Stellar RPC
- Verify account has sufficient XLM for fees
- Ensure recipient address is whitelisted

#### **Admin Functions**
- Verify admin credentials in `.env.local`
- Check admin account has sufficient XLM
- Use admin dashboard for monitoring operations

### **📋 Verification Tools**

```powershell
# Check overall system health
.\verify-deployment.ps1

# Test contract functions
.\test-contract.ps1

# Check auto-minting system
.\check-auto-minting.ps1
```

### **📚 Documentation Resources**

- **`AUTO_MINTING_CONFIG.md`** - Complete auto-minting setup guide
- **`ADMIN_MINT_GUIDE.md`** - Manual minting procedures for admins
- **`DEPLOYMENT_COMPLETE.md`** - Detailed deployment information
- **`USAGE_GUIDE.md`** - Platform usage examples
- **`STELLAR_DEPLOYMENT_GUIDE.md`** - Contract deployment procedures

### **🚨 Getting Help**

If you encounter issues:

1. **Check Configuration**: Run verification scripts first
2. **Review Documentation**: See the comprehensive guides above
3. **Check Network Status**: Stellar testnet can experience delays
4. **Admin Support**: Use the admin dashboard for operational issues
5. **Error Logs**: Check console logs for detailed error information

**Platform Status**: ✅ Production Ready  
**Auto-Minting**: ✅ Fully Operational  
**Smart Contract**: ✅ Deployed & Active

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