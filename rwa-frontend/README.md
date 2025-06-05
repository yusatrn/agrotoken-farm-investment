# 🌾 AgroToken Farm Investment Platform

A comprehensive agricultural asset tokenization and investment platform built on the Stellar blockchain. This platform enables farmers to tokenize their agricultural assets and provides investors with opportunities to invest in sustainable farming projects.

![AgroToken Platform](https://img.shields.io/badge/Stellar-Ready-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🚀 Features

### 🎯 Core Functionality
- **Agricultural Asset Tokenization**: Convert real-world farm assets into digital tokens
- **Investment Marketplace**: Browse and invest in diverse agricultural opportunities  
- **Stellar Wallet Integration**: Seamless connection with Freighter wallet
- **Real-time Balance Display**: Live XLM balance fetching from Stellar network
- **Multi-network Support**: Testnet and Mainnet compatibility

### 🌱 Agricultural Focus
- **Farm Investment Opportunities**: Organic farms, sustainable agriculture
- **Harvest-based Returns**: Investment returns tied to crop harvests
- **Certification Tracking**: Organic and sustainability certifications
- **Rural Development**: Supporting agricultural communities

### 💡 Technical Features
- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Real Blockchain Integration**: Live Stellar network connectivity
- **Production Ready**: Optimized builds and deployment configurations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Blockchain**: Stellar SDK, Freighter wallet integration
- **State Management**: Zustand
- **Build Tools**: ESLint, TypeScript compiler
- **Deployment**: Vercel-ready configuration

## ⚡ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agrotoken-farm-investment/rwa-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_STELLAR_NETWORK=testnet
   NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
   NEXT_PUBLIC_APP_NAME=AgroToken Farm Investment
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/agrotoken-farm-investment)

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy using deployment script**
   ```bash
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # Windows PowerShell
   .\deploy.ps1
   ```

3. **Set environment variables** in your deployment platform:
   - `NEXT_PUBLIC_STELLAR_NETWORK=testnet` (or `mainnet`)
   - `NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org`
   - `NEXT_PUBLIC_APP_NAME=AgroToken Farm Investment`

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔗 Wallet Integration

### Freighter Wallet Setup
1. Install [Freighter Wallet](https://freighter.app/) browser extension
2. Create or import a Stellar account
3. For testnet: Fund account using [Stellar Friendbot](https://friendbot.stellar.org/)
4. Connect wallet through the platform interface

### Supported Networks
- **Testnet**: For development and testing
- **Mainnet**: For production use

## 📱 Platform Overview

### Dashboard
- Portfolio overview with farm token holdings
- Investment performance metrics
- Quick access to platform features

### Agricultural Marketplace  
- Browse available farm investment opportunities
- Filter by crop type, location, and certification
- View detailed asset information and returns

### Asset Tokenization
- Convert physical farm assets to digital tokens
- Set investment terms and token distribution
- Manage asset metadata and documentation

### Share Transfer
- Send and receive agricultural tokens
- Track transaction history
- Manage token distributions

## 🏗️ Project Structure

```
rwa-frontend/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Portfolio dashboard
│   ├── marketplace/       # Investment marketplace
│   ├── tokenize/         # Asset tokenization
│   └── transfer/         # Token transfers
├── components/            # Reusable UI components
│   ├── layout/           # Layout components
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── stellar.ts        # Stellar network configuration
│   ├── contract.ts       # Smart contract interface
│   └── types.ts          # TypeScript definitions
├── stores/               # State management
│   ├── wallet.ts         # Wallet connection state
│   └── contract.ts       # Contract interaction state
└── public/               # Static assets
```

## 🧪 Testing

### Development Testing
```bash
npm run dev
# Test wallet connection and features
```

### Production Build Testing
```bash
npm run build
npm run start
```

### Wallet Connection Testing
1. Install Freighter wallet extension
2. Create testnet account and fund with friendbot
3. Test connection, balance display, and network switching

## 🔒 Security

- **Client-side wallet integration** (no private keys stored)
- **Environment variable configuration** for sensitive data
- **Secure network communication** with Stellar
- **Production-ready security headers**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: Open a GitHub issue
- **Questions**: Check existing discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- Built on the [Stellar blockchain](https://stellar.org)
- UI components from [Radix UI](https://radix-ui.com)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Wallet integration via [Freighter](https://freighter.app)

---

**🌾 Supporting Sustainable Agriculture Through Blockchain Technology**
