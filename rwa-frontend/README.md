# RWA Investor Frontend

A professional Next.js application for investing in Real World Asset (RWA) tokens on the Stellar blockchain. This platform enables investors to access tokenized real estate, commodities, and other physical assets through compliant blockchain technology.

## 🎯 Features

### **Core Functionality (Phase 1 - Completed)**
- ✅ **Wallet Integration**: Real Freighter wallet connection with network detection
- ✅ **Professional Dashboard**: Portfolio overview with asset statistics  
- ✅ **Token Transfer**: Secure RWA token transfers with compliance validation
- ✅ **Compliance Tracking**: KYC and whitelist status monitoring
- ✅ **Smart Contract Integration**: Mock contract client ready for production
- ✅ **Real-time Updates**: Automatic wallet state monitoring and updates

### **Architecture Highlights**
- **Modern Stack**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **State Management**: Zustand stores for wallet and contract state
- **Type Safety**: Comprehensive TypeScript interfaces matching contract structure
- **Professional UI**: Finance-focused design with Slate color scheme
- **Responsive Design**: Desktop-first approach with mobile optimization

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- [Freighter Wallet](https://freighter.app/) browser extension
- Access to Stellar Testnet

### Installation

```bash
# Clone and install
git clone <repository>
cd rwa-frontend
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Production Build
```bash
npm run build
npm start
```

## 🏗️ Project Architecture

### **Directory Structure**
```
rwa-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main dashboard  
│   ├── transfer/          # Token transfer page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components (Header)
├── lib/
│   ├── types.ts           # TypeScript definitions
│   ├── stellar.ts         # Stellar SDK utilities
│   ├── contract.ts        # Smart contract client
│   └── utils.ts           # Helper functions
├── stores/
│   ├── wallet.ts          # Wallet state (Zustand)
│   └── contract.ts        # Contract state (Zustand)
└── public/                # Static assets
```

### **Smart Contract Integration**

**Contract ID**: `CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6`
**Network**: Stellar Testnet
**Asset**: Luxury Apartment NYC (LAPT) - Premium Manhattan real estate token

**Supported Operations**:
- ✅ Balance queries
- ✅ Asset metadata retrieval  
- ✅ Compliance status checking
- ✅ Token transfers (with validation)
- ✅ Whitelist verification
- 🔄 Admin functions (minting, pausing)

### **State Management**

**Wallet Store** (`stores/wallet.ts`):
- Connection status and user address
- Network selection (testnet/mainnet)
- XLM balance tracking
- Connection management

**Contract Store** (`stores/contract.ts`):
- Asset metadata and total supply
- User token balance and compliance status
- Transaction handling
- Error and loading states

## 🎨 Design System

### **Color Palette**
- **Primary**: Deep blue (#1e40af) for professional finance look
- **Secondary**: Light gray-blue for backgrounds
- **Success**: Green for positive actions and status
- **Warning**: Amber for alerts and pending states
- **Error**: Red for validation and error states

### **Typography**
- **Body**: System fonts (Inter equivalent) for readability
- **Monospace**: For addresses, hashes, and numerical data
- **Hierarchy**: Clear sizing scale for financial data

### **Components**
- **Cards**: Clean borders with subtle shadows
- **Buttons**: Consistent sizing with proper loading states  
- **Forms**: Comprehensive validation with error messages
- **Badges**: Status indicators for compliance and asset types
- **Alerts**: Contextual information and warnings

## 🔧 Configuration

### **Environment Variables**
```env
# Optional - defaults are set in code
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6
```

### **Network Configuration**
```typescript
// lib/stellar.ts
export const NETWORKS = {
  testnet: {
    networkPassphrase: Networks.TESTNET,
    horizonUrl: 'https://horizon-testnet.stellar.org',
    sorobanUrl: 'https://soroban-testnet.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/testnet'
  },
  mainnet: { /* ... */ }
};
```

## 💼 Investment Features

### **Dashboard Overview**
- **Portfolio Value**: Real-time token holdings and USD equivalent
- **Compliance Status**: KYC verification and whitelist status  
- **Yield Information**: Projected annual returns and distribution timeline
- **Quick Actions**: Transfer, marketplace, and tokenization links

### **Transfer Interface** 
- **Address Validation**: Real-time Stellar address format checking
- **Compliance Verification**: Recipient whitelist and KYC validation
- **Amount Controls**: Max button and balance validation
- **Transaction Preview**: Fee estimation and confirmation details
- **Security**: Multiple validation layers before execution

### **Asset Information**
- **Metadata Display**: Name, description, and asset type
- **Valuation Tracking**: Current value and last update timestamp
- **Ownership Percentage**: User's share of total asset
- **Legal Documentation**: Hash verification for property deeds

## 🔐 Security & Compliance

### **Wallet Security**
- **Non-custodial**: Users maintain control of private keys
- **Session Management**: Automatic connection checking
- **Network Validation**: Testnet/mainnet switching with confirmation

### **Transaction Safety**
- **Multi-step Validation**: Address format, compliance, and balance checks
- **Confirmation Dialogs**: Clear transaction details before execution  
- **Error Handling**: Graceful failure management with user feedback
- **Fee Transparency**: Network fee estimation and display

### **Compliance Framework**
- **KYC Integration**: Verification status tracking
- **Jurisdiction Compliance**: Location-based transfer restrictions
- **Whitelist Management**: Automated address verification
- **Audit Trail**: Transaction history and compliance logs

## 🚧 Development Roadmap

### **Phase 2: Enhanced Trading** (Planned)
- [ ] Asset marketplace with filtering and search
- [ ] Investment calculator with ROI projections  
- [ ] Order book and trading interface
- [ ] Price charts and market data

### **Phase 3: Tokenization Engine** (Planned)
- [ ] Multi-step asset tokenization wizard
- [ ] Document upload and verification system
- [ ] Legal compliance automation
- [ ] Smart contract deployment interface

### **Phase 4: Advanced Features** (Planned)
- [ ] Admin panel with role-based access
- [ ] Revenue distribution automation
- [ ] Advanced analytics and reporting  
- [ ] Mobile app (React Native)

## 🧪 Testing Strategy

### **Current Implementation**
- **Mock Contract Client**: Simulates all smart contract interactions
- **Test Data**: Realistic asset metadata and balances
- **Validation Testing**: Address format and compliance checking
- **Error Simulation**: Network failures and validation errors

### **Production Preparation**
- [ ] Unit tests for utilities and components
- [ ] Integration tests for wallet and contract interactions
- [ ] E2E tests for critical user flows
- [ ] Smart contract integration testing

## 🐛 Known Issues & Limitations

### **Current Limitations**
- **Simulated Compliance**: Recipient compliance checking is mocked
- **Static Data**: Asset metadata and balances are not live
- **Network Warnings**: Stellar SDK warnings in build (expected)
- **Network Switching**: Users must manually switch networks in Freighter extension

### **Freighter Integration**
The application now uses the official Freighter API for wallet connection:

```typescript
// stores/wallet.ts - Production implementation
import {
  isConnected,
  requestAccess,
  getAddress,
  getNetwork,
  getNetworkDetails,
  WatchWalletChanges
} from '@stellar/freighter-api';

const connect = async () => {
  const connectionResult = await isConnected();
  const accessResult = await requestAccess();
  const networkResult = await getNetworkDetails();
  // Real wallet integration with proper error handling
};
```

**Features:**
- ✅ Real wallet connection detection
- ✅ Automatic network detection (Testnet/Mainnet)
- ✅ Address retrieval and validation
- ✅ Real-time wallet state monitoring
- ✅ Proper error handling and user feedback
- ✅ Automatic disconnection on extension disable

## 📚 Smart Contract Details

### **Asset Metadata Structure**
```typescript
interface AssetMetadata {
  name: string;              // "Luxury Apartment NYC"
  symbol: string;            // "LAPT"  
  asset_type: string;        // "real_estate"
  description: string;       // Asset description
  valuation: string;         // Current USD value (i128)
  last_valuation_date: number; // Unix timestamp
  legal_doc_hash: string;    // Property deed hash
}
```

### **Compliance Data Structure**
```typescript
interface ComplianceData {
  kyc_verified: boolean;     // KYC completion status
  accredited_investor: boolean; // Accreditation status
  jurisdiction: string;      // Legal jurisdiction
  compliance_expiry: number; // Compliance expiration
}
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Make changes**: Follow the existing code style and patterns
4. **Test thoroughly**: Ensure no regressions  
5. **Submit PR**: Include clear description of changes

### **Code Style**
- **TypeScript**: Strict mode with comprehensive type definitions
- **Components**: Functional components with proper prop typing
- **Styling**: Tailwind CSS with shadcn/ui component patterns
- **State**: Zustand stores with typed interfaces

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

### **Common Issues**
- **Wallet Connection**: Ensure Freighter extension is installed and enabled
- **Network Issues**: Check Stellar Testnet status and connectivity
- **Build Warnings**: Stellar SDK warnings are expected in web environments

### **Resources**
- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://freighter.app/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Built with ❤️ for the future of tokenized real world assets**
