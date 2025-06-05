# AgroToken Farm Investment Platform - Deployment Guide

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/agrotoken-farm-investment&project-name=agrotoken-farm-investment&repository-name=agrotoken-farm-investment)

## 📋 Deployment Steps

### 1. Prerequisites
- Node.js 18+ installed
- Git repository set up
- Vercel account (free tier available)

### 2. Environment Variables
Set these environment variables in your deployment platform:

```bash
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_APP_NAME=AgroToken Farm Investment
```

For production deployment, change to:
```bash
NEXT_PUBLIC_STELLAR_NETWORK=mainnet
NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon.stellar.org
```

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
cd rwa-frontend
vercel

# Follow the prompts to configure your deployment
```

#### Option B: Deploy via GitHub Integration
1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy on every push to main branch
4. Set environment variables in Vercel dashboard

### 4. Deploy to Other Platforms

#### Netlify
```bash
# Build the project
npm run build

# Deploy the out folder to Netlify
```

#### Railway
```bash
# Connect your GitHub repo to Railway
# Railway will auto-detect Next.js and deploy
```

#### Self-hosted with Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Stellar Network Configuration
- **Testnet**: For development and testing
- **Mainnet**: For production deployment

### Wallet Integration
- Requires users to have Freighter wallet extension installed
- Automatically detects and connects to user's wallet
- Fetches real XLM balances from Stellar network

### Smart Contract Integration
- Currently using mock contract client
- Replace with actual Soroban contract integration for production
- Contract ID: `CBQAAC4EHNMMHEI2W3QU6UQ5N4KSVYRLVTB5M2XMARCNS4CNLWMX3VQ6`

## 🧪 Testing

### Local Testing
```bash
npm run dev
# Open http://localhost:3000
```

### Build Testing
```bash
npm run build
npm run start
```

### Wallet Testing
1. Install Freighter wallet extension
2. Create test account on Stellar testnet
3. Fund account with test XLM from friendbot
4. Test wallet connection and balance display

## 📱 Features

- **Dashboard**: Overview of farm investments and portfolio
- **Marketplace**: Browse available agricultural investment opportunities
- **Tokenization**: Convert real-world agricultural assets to tokens
- **Transfer**: Send and receive agricultural tokens
- **Wallet Integration**: Seamless Stellar wallet connectivity

## 🌾 Agricultural Focus

The platform specializes in:
- Farm asset tokenization
- Agricultural investment opportunities
- Harvest-based returns
- Sustainable farming certifications
- Rural development financing

## 🔒 Security

- Client-side wallet integration (no private keys stored)
- Environment variable configuration
- Secure Stellar network communication
- Production-ready security headers

## 📞 Support

For deployment issues or questions:
1. Check the [troubleshooting guide](./TROUBLESHOOTING.md)
2. Review Vercel deployment logs
3. Verify environment variables are set correctly
4. Ensure Stellar network connectivity
