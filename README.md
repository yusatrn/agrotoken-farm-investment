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
git clone <repository-url>
cd rwa-investment-platform

# Navigate to frontend directory
cd rwa-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the platform.

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

## 🎨 **User Interface Guide**

### **🏠 Dashboard Page (`/`)**
- Portfolio value and performance metrics
- Compliance status indicators
- Quick action buttons
- Investment opportunities overview

### **🏪 Marketplace Page (`/marketplace`)**
- Asset discovery with search and filtering
- Investment statistics and analytics
- Asset cards with key metrics
- Direct investment flow

### **🏭 Tokenization Page (`/tokenize`)**
- 5-step asset tokenization wizard
- Document upload and verification
- Token economics configuration
- Compliance settings and deployment

### **💸 Transfer Page (`/transfer`)**
- Secure token transfer interface
- Address validation and compliance checking
- Transaction preview and confirmation
- Real-time balance updates

---

## 🔐 **Security & Compliance**

### **Wallet Security**
- Non-custodial wallet integration
- Private key remains with user
- Session management and auto-disconnect
- Network validation and switching

### **Transaction Safety**
- Multi-step validation process
- Compliance verification before transfers
- Clear transaction previews
- Comprehensive error handling

### **Regulatory Compliance**
- KYC verification requirements
- Jurisdiction-based restrictions
- Accredited investor validation
- Audit trail maintenance

---

## 🌟 **Current Features**

### **✅ Phase 1: Core Investment Platform (Completed)**
- [x] Professional investor dashboard
- [x] Asset marketplace with filtering
- [x] Secure token transfer system
- [x] Freighter wallet integration
- [x] Smart contract mock client
- [x] Responsive UI/UX design
- [x] TypeScript type safety
- [x] Compliance tracking

### **🔄 Phase 2: Enhanced Trading (In Development)**
- [ ] Advanced marketplace features
- [ ] Investment calculator and ROI projections
- [ ] Order book and trading interface
- [ ] Price charts and market data
- [ ] Portfolio analytics

### **📋 Phase 3: Tokenization Engine (Planned)**
- [ ] Complete tokenization wizard
- [ ] Document verification system
- [ ] Legal compliance automation
- [ ] Smart contract deployment
- [ ] Asset management tools

### **🔮 Phase 4: Advanced Features (Future)**
- [ ] Admin panel with role-based access
- [ ] Revenue distribution automation
- [ ] Advanced analytics and reporting
- [ ] Mobile application (React Native)
- [ ] Multi-chain support

---

## 🛠️ **Development**

### **Environment Setup**

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build production bundle
npm run build
```

### **Environment Variables**

```env
# Optional - defaults are provided
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ID=CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6
```

### **Configuration Files**

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration |
| `tailwind.config.ts` | Tailwind CSS settings |
| `tsconfig.json` | TypeScript configuration |
| `components.json` | shadcn/ui component config |

---

## 🧪 **Testing Strategy**

### **Current Testing Approach**
- **Mock Contract Client**: Simulates all blockchain interactions
- **Test Data**: Realistic asset metadata and user balances
- **Validation Testing**: Address format and compliance checking
- **Error Simulation**: Network failures and edge cases

### **Planned Testing Implementation**
- [ ] Unit tests for utilities and components
- [ ] Integration tests for wallet and contract flows
- [ ] End-to-end tests for critical user journeys
- [ ] Smart contract integration testing
- [ ] Performance testing and optimization

---

## 📈 **Asset Types Supported**

### **🏢 Real Estate**
- **Minimum Value**: $100,000
- **Examples**: Apartment buildings, office complexes, retail spaces
- **Current**: Luxury Apartment NYC (LAPT) - $2.5M Manhattan property

### **🏅 Commodities**
- **Minimum Value**: $50,000
- **Examples**: Gold storage, oil reserves, agricultural products
- **Planned**: Gold Storage Facility (Delaware) - $3M precious metals facility

### **⚡ Infrastructure**
- **Minimum Value**: $500,000
- **Examples**: Solar farms, data centers, transportation hubs
- **Planned**: Renewable Energy Farm (Texas) - $8M solar project

---

## 🚨 **Known Limitations**

### **Current Development Constraints**
- **Simulated Compliance**: Recipient validation is mocked for development
- **Static Asset Data**: Metadata and balances are not live from blockchain
- **Network Warnings**: Stellar SDK warnings in web environment (expected)
- **Manual Network Switching**: Users must switch networks in Freighter manually

### **Production Readiness Checklist**
- [ ] Connect to live smart contracts
- [ ] Implement real compliance verification
- [ ] Add comprehensive error handling
- [ ] Implement proper testing suite
- [ ] Security audit and penetration testing
- [ ] Legal compliance review

---

## 🤝 **Contributing**

We welcome contributions to the RWA Investment Platform! Here's how to get started:

### **Development Workflow**

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow code style**: Use existing TypeScript and component patterns
4. **Test thoroughly**: Ensure no regressions in existing functionality
5. **Submit pull request**: Include clear description of changes

### **Code Style Guidelines**

- **TypeScript**: Strict mode with comprehensive type definitions
- **Components**: Functional components with proper prop typing
- **Styling**: Tailwind CSS classes with shadcn/ui patterns
- **State Management**: Zustand stores with typed interfaces
- **Naming**: Descriptive variable and function names

### **Contribution Areas**

- 🐛 **Bug Fixes**: Address issues and improve stability
- ✨ **New Features**: Implement roadmap items or propose new functionality
- 📚 **Documentation**: Improve guides and API documentation
- 🎨 **UI/UX**: Enhance design and user experience
- 🔧 **Performance**: Optimize loading times and responsiveness

---

## 📚 **Resources**

### **Documentation**
- [Stellar Documentation](https://developers.stellar.org/)
- [Freighter Wallet](https://freighter.app/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### **Community**
- [Stellar Discord](https://discord.gg/stellar)
- [Next.js Discord](https://discord.gg/nextjs)
- [GitHub Issues](link-to-issues)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 **Acknowledgments**

- **Stellar Development Foundation** for blockchain infrastructure
- **shadcn** for exceptional UI component library
- **Vercel** for Next.js framework and deployment platform
- **Tailwind Labs** for utility-first CSS framework

---

## 📞 **Support**

### **Getting Help**
- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: Report bugs via GitHub Issues
- 💬 **Community**: Join our Discord for discussions
- 📧 **Direct Contact**: [Your contact information]

### **Common Issues**

| Issue | Solution |
|-------|----------|
| Wallet not connecting | Ensure Freighter extension is installed and enabled |
| Build warnings | Stellar SDK warnings are expected in web environments |
| Network switching | Manually switch networks in Freighter extension |
| Transaction failures | Check address format and compliance status |

---

<div align="center">

**Built with ❤️ for the future of tokenized real world assets**

[Website](link) • [Documentation](link) • [Discord](link) • [Twitter](link)

</div> 