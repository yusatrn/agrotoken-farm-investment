#!/bin/bash
# Deployment script for AgroToken Farm Investment Platform

echo "🌾 AgroToken Farm Investment Platform - Deployment Script"
echo "=========================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the rwa-frontend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run linting
echo "🔍 Running linting..."
npm run lint

# Run type checking and build
echo "🏗️  Building for production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🚀 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect to Vercel/Netlify/Railway"
    echo "3. Set environment variables:"
    echo "   - NEXT_PUBLIC_STELLAR_NETWORK=testnet (or mainnet)"
    echo "   - NEXT_PUBLIC_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org"
    echo "   - NEXT_PUBLIC_APP_NAME=AgroToken Farm Investment"
    echo ""
    echo "For Vercel quick deploy:"
    echo "npm i -g vercel && vercel"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
