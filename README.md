# 🌾 AgroToken Farm Investment Platform

<div align="center">

**[English](#english) | [Türkçe](#türkçe)**

</div>

---

<a name="english"></a>
## 🇺🇸 English

A comprehensive agricultural asset tokenization and investment platform built on the Stellar blockchain. This platform enables farmers to tokenize their agricultural assets and allows investors to participate in sustainable agriculture.

![AgroToken Platform](https://img.shields.io/badge/Platform-AgroToken_Farm_Investment-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-brightgreen)
![Framework](https://img.shields.io/badge/Framework-Next.js_15-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-green)

### 🎯 **Project Overview**

The AgroToken Farm Investment Platform democratizes access to agricultural investments by tokenizing farm assets on the Stellar blockchain. Farmers can access funding without selling their land, while investors can make secure and transparent investments in sustainable agriculture.

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

### **📱 Platform Features**
- 🌾 **Multi-Farm Support** - Cropland, livestock, dairy farms, food processing
- ⚡ **Stellar Integration** - Fast, low-cost blockchain transactions
- 🛡️ **Organic Compliance** - Built-in organic certification and investor validation
- 📱 **Responsive Design** - Professional UI optimized for agricultural investments

---

### 🔑 **Stellar Network Information**

#### **Smart Contract Details**
- **Contract ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Network**: Stellar Testnet
- **Asset**: AgroToken Farm Investment (AGRO)
- **Type**: Agricultural asset tokenization platform

#### **Public Key Information**
```
Admin Public Key: GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
```

> **Note**: This public key has contract admin privileges and is used for platform management. Secret key information is not shared for security reasons.

#### **Network Configuration**
```bash
# Stellar Testnet
RPC_URL=https://soroban-testnet.stellar.org:443
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Contract Explorer
https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX
```

---

### 🚀 **Quick Start**

#### **Prerequisites**
- Node.js 18+ installed
- [Freighter Wallet](https://freighter.app/) browser extension
- Access to Stellar Testnet for development

#### **Installation**

```bash
# Clone the repository
git clone https://github.com/yusatrn/agrotoken-farm-investment.git
cd agrotoken-farm-investment

# Navigate to frontend directory
cd rwa-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to access the AgroToken platform.

#### **Environment Configuration**

Create `.env.local` file in the `rwa-frontend` directory:

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

---

### 🏗️ **Project Architecture**

#### **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + TypeScript | React-based web application |
| **Styling** | Tailwind CSS + shadcn/ui | Professional UI components |
| **State Management** | Zustand | Lightweight state management |
| **Blockchain** | Stellar SDK | Blockchain integration |
| **Wallet** | Freighter API | Wallet connectivity |
| **Icons** | Lucide React | Professional icon system |

#### **Directory Structure**

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
│   └── ...
├── components/
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── lib/
│   ├── types.ts           # TypeScript definitions
│   ├── stellar.ts         # Stellar SDK utilities
│   └── ...
└── public/                # Static assets
```

---

### 🤖 **Automatic Token Minting System**

The AgroToken platform features a sophisticated multi-layered automatic token minting system that eliminates the need for manual admin intervention when users make investments.

#### **How It Works**

1. **Primary Path - Server-side API Minting**: Uses admin credentials to mint tokens automatically through `/api/mint-tokens`
2. **Secondary Path - Direct User Wallet**: For users with admin privileges, tokens are minted directly 
3. **Fallback Path - Background Queue**: Failed mints are queued for processing via `/api/queue-mint`

#### **Security Features**

- Admin credentials stored securely server-side only
- Multi-layer authentication for API endpoints
- Background processing with internal API security
- Transaction verification and status monitoring

---

### 💼 **Smart Contract Integration**

#### **Supported Operations**

| Operation | Description | Status |
|-----------|-------------|--------|
| `balance` | Query user's token balance | ✅ Implemented |
| `get_metadata` | Retrieve asset information | ✅ Implemented |
| `transfer` | Send tokens between addresses | ✅ Implemented |
| `check_compliance` | Verify KYC/whitelist status | ✅ Implemented |
| `get_supply` | Get total token supply | ✅ Implemented |
| `mint_simple` | Create new tokens (automated) | ✅ Auto-minting |
| `mint` | Create new tokens (admin) | ✅ Implemented |
| `pause` | Pause contract operations | ✅ Admin only |

---

### 🧪 **Testing & Validation**

The AgroToken platform provides comprehensive manual testing documentation to validate all functionality from contract operations to frontend integration.

#### **📋 Manuel Test Rehberi**

**[MANUEL_TEST_REHBERI.md](./MANUEL_TEST_REHBERI.md)** - Kapsamlı manuel test talimatları  
**[HIZLI_BASLANGIC.md](./HIZLI_BASLANGIC.md)** - 5 dakikada başlangıç rehberi

#### **🚀 Temel Test Kategorileri**

| Test Kategorisi | Amaç | Test Edilen Özellikler |
|-----------------|------|----------------------|
| **Çevre Kontrolü** | Gerekli araçların varlığını doğrula | Stellar CLI, Node.js, ağ bağlantısı |
| **Anahtar Yönetimi** | Stellar anahtarlarını yönet | Anahtar oluşturma, fonlama, adres kontrolü |
| **Kontrat İşlemleri** | Temel kontrat fonksiyonları | Metadata, admin, supply sorguları |
| **Token İşlemleri** | Token transfer ve bakiye | Bakiye kontrolü, transfer işlemleri |
| **Frontend Testi** | Web arayüz doğrulaması | Sayfalar, wallet bağlantısı, işlemler |
| **API Testleri** | Arka plan servisler | Auto-minting, admin kontrolü |

#### **🔧 Hızlı Test Komutları**

```bash
# Kontrat metadata kontrolü
stellar contract invoke --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice --network testnet -- get_metadata

# Token bakiye kontrolü
stellar contract invoke --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice --network testnet -- balance \
  --address $(stellar keys address alice)

# Frontend başlatma
cd rwa-frontend && npm run dev
```

#### **📊 Test Durumu**

- ✅ **Kontrat Deployed** - Stellar Testnet'te aktif
- ✅ **Frontend Çalışıyor** - Next.js 15 + TypeScript
- ✅ **Auto-minting** - API endpoints aktif
- ✅ **Wallet Integration** - Freighter wallet desteği
- ✅ **Real Transactions** - Gerçek blockchain işlemleri

#### **🔗 Test Kaynakları**

- **Contract Explorer**: [stellar.expert](https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX)
- **Network**: Stellar Testnet
- **Test Faucet**: [friendbot.stellar.org](https://friendbot.stellar.org)

---

### 🎯 **Platform Status & Getting Started**

#### **✅ Production Ready Features**
- ✅ **Smart Contract Deployed** - Live on Stellar Testnet with full functionality
- ✅ **Automatic Token Minting** - Multi-layered system with server-side, user wallet, and queue fallbacks
- ✅ **Real Blockchain Integration** - Freighter wallet integration with actual Stellar transactions
- ✅ **Admin Dashboard** - Complete monitoring and management interface
- ✅ **Investment Flow** - End-to-end investment process with automatic token delivery
- ✅ **Error Handling** - Comprehensive error recovery and user feedback
- ✅ **Transaction Monitoring** - Real-time status updates and transaction tracking

---

### 📞 **Support & Troubleshooting**

#### **🔧 Common Issues & Solutions**

**Auto-Minting Issues**
```bash
# Check auto-minting configuration
.\verify-auto-minting.ps1

# Test auto-minting endpoints
.\test-auto-minting.ps1

# Manual token minting if automatic fails
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"
```

**Wallet Connection Issues**
- Ensure Freighter wallet is installed and unlocked
- Switch to Stellar Testnet in Freighter settings
- Fund your testnet account with XLM

**Transaction Failures**
- Check network connectivity to Stellar RPC
- Verify account has sufficient XLM for fees
- Ensure recipient address is whitelisted

---

### 🌱 **Vision & Impact**

AgroToken Farm Investment Platform bridges the gap between traditional agriculture and modern blockchain technology, enabling:

- **For Farmers**: Access to global capital while retaining farm ownership
- **For Investors**: Direct participation in sustainable agriculture with transparent returns
- **For the Industry**: Traceable supply chain and sustainable farming incentives

---

<a name="türkçe"></a>
## 🇹🇷 Türkçe

Stellar blockchain üzerinde tarımsal varlık tokenizasyonu ve yatırım platformu. Bu platform, çiftçilerin tarımsal varlıklarını tokenize etmesini sağlar ve yatırımcılara sürdürülebilir tarıma yatırım fırsatları sunar.

### 🎯 **Proje Genel Bakış**

AgroToken Farm Investment Platform, tarımsal varlıkları Stellar blockchain üzerinde tokenize ederek tarıma erişimi demokratikleştirir. Çiftçiler arazilerini satmadan finansmana erişebilir, yatırımcılar da sürdürülebilir tarıma güvenli ve şeffaf yatırım yapabilir.

### **🌟 Ana Özellikler**

#### **Çiftçiler İçin**
- 🚜 **Çiftlik Tokenizasyonu** - Tarımsal varlıkları ticarete konu çiftlik hisselerine dönüştürme
- 💰 **Sermayeye Erişim** - Çiftlik sahipliğini koruyarak finansman sağlama
- 📋 **Uyumluluk Yönetimi** - Organik sertifikasyon ve tarımsal uyumluluk araçları
- 🌱 **Sürdürülebilirlik Odağı** - Organik ve sürdürülebilir tarım uygulamalarına destek

#### **Yeni Özellikler**
- ✨ **Otomatik Token Basımı** - Yatırım yapıldığında tokenlerin otomatik olarak basılması
- 🔄 **Çok Katmanlı Basım Yaklaşımı** - Sunucu tarafı, kullanıcı cüzdanı ve arka plan kuyruğu yedekleri
- 📊 **İşlem Durumu İzleme** - Token basım işlemleri için gerçek zamanlı durum güncellemeleri
- 🛡️ **Admin Paneli** - Token basım işlemlerini izleme ve yönetme

#### **Yatırımcılar İçin**
- 💼 **Çiftlik Portföy Paneli** - Gerçek zamanlı değerlemeler ile tarımsal yatırımların genel görünümü
- 🏪 **Tarımsal Pazar Yeri** - Çiftlik yatırım fırsatlarını keşfetme ve filtreleme
- 💸 **Güvenli Hisse Transferleri** - Uyumluluk doğrulaması ile çiftlik hisselerini gönderme/alma
- 📊 **Performans Takibi** - Verim, organik sertifikasyon durumu ve hasat projeksiyonlarını izleme
- 🔐 **Cüzdan Entegrasyonu** - Freighter cüzdan bağlantısı

### **📱 Platform Özellikleri**
- 🌾 **Çoklu Çiftlik Desteği** - Tarla, hayvancılık, süt çiftlikleri, gıda işleme
- ⚡ **Stellar Entegrasyonu** - Hızlı, düşük maliyetli blockchain işlemleri
- 🛡️ **Organik Uyumluluk** - Yerleşik organik sertifikasyon ve yatırımcı doğrulaması
- 📱 **Duyarlı Tasarım** - Tarımsal yatırımlar için optimize edilmiş profesyonel UI

---

### 🔑 **Stellar Network Bilgileri**

#### **Smart Contract Detayları**
- **Contract ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Network**: Stellar Testnet
- **Asset**: AgroToken Farm Investment (AGRO)
- **Type**: Tarımsal varlık tokenizasyon platformu

#### **Public Key Bilgileri**
```
Admin Public Key: GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
```

> **Not**: Bu public key, contract admin yetkilerine sahiptir ve platform yönetimi için kullanılır. Secret key bilgileri güvenlik nedeniyle paylaşılmaz.

#### **Network Konfigürasyonu**
```bash
# Stellar Testnet
RPC_URL=https://soroban-testnet.stellar.org:443
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE="Test SDF Network ; September 2015"

# Contract Explorer
https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX
```

---

### 🚀 **Hızlı Başlangıç**

#### **Ön Gereksinimler**
- Node.js 18+ yüklü
- [Freighter Wallet](https://freighter.app/) tarayıcı uzantısı
- Geliştirme için Stellar Testnet erişimi

#### **Kurulum**

```bash
# Repository'yi klonlayın
git clone https://github.com/yusatrn/agrotoken-farm-investment.git
cd agrotoken-farm-investment

# Frontend dizinine gidin
cd rwa-frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

`http://localhost:3000` adresini ziyaret ederek AgroToken platformuna erişin.

#### **Çevre Değişkenleri Konfigürasyonu**

`.env.local` dosyasını `rwa-frontend` dizininde oluşturun:

```bash
# Admin kimlik bilgileri (otomatik basım için)
CONTRACT_ADMIN_PUBLIC_KEY=GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
CONTRACT_ADMIN_SECRET_KEY=YOUR_ACTUAL_SECRET_KEY_HERE

# Network konfigürasyonu
STELLAR_NETWORK=testnet
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API güvenliği
INTERNAL_API_KEY=your_secure_api_key_here
```

---

### 🏗️ **Proje Mimarisi**

#### **Teknoloji Yığını**

| Bileşen | Teknoloji | Amaç |
|---------|-----------|------|
| **Frontend** | Next.js 15 + TypeScript | React tabanlı web uygulaması |
| **Styling** | Tailwind CSS + shadcn/ui | Profesyonel UI bileşenleri |
| **State Management** | Zustand | Hafif state yönetimi |
| **Blockchain** | Stellar SDK | Blockchain entegrasyonu |
| **Wallet** | Freighter API | Cüzdan bağlantısı |
| **Icons** | Lucide React | Profesyonel ikon sistemi |

---

### 🤖 **Otomatik Token Basım Sistemi**

AgroToken platformu, kullanıcılar yatırım yaptıklarında manuel admin müdahalesine gerek duymayan gelişmiş çok katmanlı otomatik token basım sistemi içerir.

#### **Nasıl Çalışır**

1. **Birincil Yol - Sunucu tarafı API Basımı**: `/api/mint-tokens` üzerinden admin kimlik bilgileri kullanarak otomatik token basımı
2. **İkincil Yol - Doğrudan Kullanıcı Cüzdanı**: Admin yetkilerine sahip kullanıcılar için doğrudan basım
3. **Yedek Yol - Arka Plan Kuyruğu**: Başarısız basımlar `/api/queue-mint` üzerinden işleme alınır

#### **Güvenlik Özellikleri**

- Admin kimlik bilgileri yalnızca sunucu tarafında güvenli şekilde saklanır
- API endpoints için çok katmanlı kimlik doğrulama
- İç API güvenliği ile arka plan işleme
- İşlem doğrulama ve durum izleme

---

### 💼 **Smart Contract Entegrasyonu**

#### **Desteklenen İşlemler**

| İşlem | Açıklama | Durum |
|-------|----------|-------|
| `get_balance` | Kullanıcının token bakiyesini sorgulama | ✅ Uygulandı |
| `get_metadata` | Varlık bilgilerini alma | ✅ Uygulandı |
| `transfer` | Adresler arası token gönderimi | ✅ Uygulandı |
| `check_compliance` | KYC/whitelist durum doğrulaması | ✅ Uygulandı |
| `get_supply` | Toplam token arzını alma | ✅ Uygulandı |
| `mint_simple` | Yeni token oluşturma (otomatik) | ✅ Otomatik basım |
| `mint` | Yeni token oluşturma (admin) | ✅ Uygulandı |
| `pause` | Contract işlemlerini durdurma | ✅ Sadece admin |

---

### 🎯 **Platform Durumu & Başlangıç**

#### **✅ Üretime Hazır Özellikler**
- ✅ **Smart Contract Dağıtıldı** - Stellar Testnet'te tam işlevsellikle canlı
- ✅ **Otomatik Token Basımı** - Sunucu tarafı, kullanıcı cüzdanı ve kuyruk yedekleri ile çok katmanlı sistem
- ✅ **Gerçek Blockchain Entegrasyonu** - Gerçek Stellar işlemleri ile Freighter cüzdan entegrasyonu
- ✅ **Admin Paneli** - Tam izleme ve yönetim arayüzü
- ✅ **Yatırım Akışı** - Otomatik token teslimatı ile uçtan uca yatırım süreci
- ✅ **Hata İşleme** - Kapsamlı hata kurtarma ve kullanıcı geri bildirimi
- ✅ **İşlem İzleme** - Gerçek zamanlı durum güncellemeleri ve işlem takibi

---

### 📞 **Destek & Sorun Giderme**

#### **🔧 Yaygın Sorunlar & Çözümler**

**Otomatik Basım Sorunları**
```bash
# Otomatik basım konfigürasyonunu kontrol edin
.\verify-auto-minting.ps1

# Otomatik basım endpoints'lerini test edin
.\test-auto-minting.ps1

# Otomatik başarısız olursa manuel token basımı
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"
```

**Cüzdan Bağlantı Sorunları**
- Freighter cüzdan yüklü ve kilidi açık olduğundan emin olun
- Freighter ayarlarında Stellar Testnet'e geçin
- Testnet hesabınızı XLM ile fonlayın

**İşlem Başarısızlıkları**
- Stellar RPC'ye ağ bağlantısını kontrol edin
- Hesabın ücretler için yeterli XLM'ye sahip olduğunu doğrulayın
- Alıcı adresinin whitelist'te olduğundan emin olun

---

### 🌱 **Vizyon & Etki**

AgroToken Farm Investment Platform, geleneksel tarım ile modern blockchain teknolojisi arasındaki köprüyü kurar ve şunları sağlar:

- **Çiftçiler İçin**: Çiftlik sahipliğini koruyarak küresel sermayeye erişim
- **Yatırımcılar İçin**: Şeffaf getirilerle sürdürülebilir tarıma doğrudan katılım
- **Sektör İçin**: İzlenebilir tedarik zinciri ve sürdürülebilir tarım teşvikleri

---

<div align="center">

**🌾 Built with ❤️ for the future of sustainable agriculture 🌾**

*"From farm to blockchain - Growing sustainable investments for tomorrow's agriculture"*

**Sürdürülebilir tarımın geleceği için ❤️ ile inşa edildi**

*"Çiftlikten blockchain'e - Yarının tarımı için sürdürülebilir yatırımlar büyütüyoruz"*

**[Live Demo](http://localhost:3000) • [Documentation](./DEPLOYMENT_COMPLETE.md) • [Community](https://github.com/yusatrn/agrotoken-farm-investment) • [Contact](mailto:yusatrn@example.com)**

</div>

---

### 📄 **License / Lisans**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

### 🤝 **Contributing / Katkıda Bulunma**

Contributions are welcome! Please feel free to submit a Pull Request.

Katkılar memnuniyetle karşılanır! Lütfen Pull Request göndermekten çekinmeyin.

### ⭐ **Support / Destek**

If you find this project helpful, please give it a star ⭐ on GitHub!

Bu projeyi faydalı bulduysanız, lütfen GitHub'da bir yıldız ⭐ verin!

---

### 🔐 **Security Notes / Güvenlik Notları**

**English:**
- **Secret Keys**: Never store secret keys in the repository
- **Environment Variables**: Store sensitive information in `.env.local` file
- **Production**: Use proper key management in production environment
- **Network**: Conduct appropriate security audits for mainnet usage

**Türkçe:**
- **Secret Key'ler**: Hiçbir zaman secret key'leri repository'de saklamayın
- **Environment Variables**: Hassas bilgileri `.env.local` dosyasında saklayın
- **Production**: Production ortamında mutlaka güvenli key yönetimi kullanın
- **Network**: Mainnet kullanımı için uygun security audit'ler yapın

> **Warning / Uyarı**: This platform currently operates on Stellar Testnet for testing purposes. Additional security measures should be taken for production use.
>
> Bu platform şu anda Stellar Testnet üzerinde test amaçlı olarak çalışmaktadır. Production kullanımı için ek güvenlik önlemleri alınmalıdır.

---

**Last Updated / Son Güncelleme**: 2025-06-07  
**Repository Owner / Repository Sahibi**: [@yusatrn](https://github.com/yusatrn)
