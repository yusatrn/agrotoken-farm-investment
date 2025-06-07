# 🏗️ RWA Token Template - Real World Assets Tokenization

Bu template, gerçek dünya varlıklarını tokenize etmek için hazırlanmış bir Stellar/Soroban smart contract ve frontend template'idir.

## 🎯 Template Özellikleri

### 📋 Desteklenen Varlık Türleri
- 🏠 **Gayrimenkul** (Real Estate)
- 🌾 **Tarım Ürünleri** (Agriculture) 
- 💎 **Değerli Metaller** (Precious Metals)
- 🎨 **Sanat Eserleri** (Art & Collectibles)
- ⚡ **Enerji Varlıkları** (Energy Assets)
- 🚗 **Araçlar** (Vehicles)
- 📊 **Diğer Fiziksel Varlıklar** (Other Physical Assets)

### 🔧 Teknik Özellikler
- ✅ Stellar/Soroban Smart Contract (Rust)
- ✅ Next.js 14 Frontend (TypeScript)
- ✅ Compliance & KYC entegrasyonu
- ✅ Admin Dashboard
- ✅ Multi-user yönetimi
- ✅ Transfer & Minting işlemleri
- ✅ Freighter Wallet entegrasyonu

## 🚀 Hızlı Başlangıç

### 1. Template Projesini Oluştur
```powershell
# Yeni proje klasörü oluştur
mkdir my-rwa-project
cd my-rwa-project

# Template dosyalarını kopyala
# (Bu adımları takip edin)
```

### 2. Proje Türünü Seç
Template'i farklı varlık türleri için özelleştirin:

#### 🏠 Gayrimenkul Projesi
```powershell
$ASSET_TYPE = "real_estate"
$TOKEN_SYMBOL = "REAL"
$PROJECT_NAME = "RealToken"
```

#### 🌾 Tarım Projesi (Mevcut AgroToken gibi)
```powershell
$ASSET_TYPE = "agriculture"
$TOKEN_SYMBOL = "AGRO"
$PROJECT_NAME = "AgroToken"
```

#### 💎 Değerli Metal Projesi
```powershell
$ASSET_TYPE = "precious_metals"
$TOKEN_SYMBOL = "GOLD"
$PROJECT_NAME = "GoldToken"
```

### 3. Smart Contract'ı Özelleştir
```rust
// src/lib.rs içinde varlık tipini değiştir
pub const ASSET_TYPE: &str = "real_estate"; // veya agriculture, precious_metals, etc.
pub const TOKEN_NAME: &str = "RealToken Property Investment";
pub const TOKEN_SYMBOL: &str = "REAL";
```

### 4. Frontend'i Özelleştir
```typescript
// app/config.ts dosyasında
export const PROJECT_CONFIG = {
  assetType: "real_estate",
  tokenSymbol: "REAL", 
  projectName: "RealToken",
  description: "Real estate tokenization platform"
};
```

## 📁 Template Dosya Yapısı

```
rwa-template/
├── 📄 README.md                    # Proje açıklaması
├── 📄 Cargo.toml                   # Rust dependencies
├── 📄 .env.template                # Environment değişkenleri
├── 📄 DEPLOYMENT_GUIDE.md          # Deploy rehberi
├── 📄 CUSTOMIZATION_GUIDE.md       # Özelleştirme rehberi
├── 📄 TEST_TEMPLATE.md             # Test şablonu
├── 🗂️ src/
│   ├── 📄 lib.rs                   # Ana smart contract
│   ├── 📄 compliance.rs            # KYC/Compliance modülü
│   ├── 📄 admin.rs                 # Admin işlemleri
│   └── 📄 types.rs                 # Veri türleri
├── 🗂️ frontend-template/
│   ├── 📄 package.json
│   ├── 📄 next.config.js
│   ├── 🗂️ app/
│   │   ├── 📄 page.tsx             # Ana sayfa
│   │   ├── 📄 config.ts            # Proje konfigürasyonu
│   │   ├── 🗂️ marketplace/         # Varlık pazarı
│   │   ├── 🗂️ invest/              # Yatırım sayfası
│   │   ├── 🗂️ admin/               # Admin dashboard
│   │   └── 🗂️ api/                 # API endpoints
│   ├── 🗂️ components/
│   │   ├── 🗂️ asset-specific/      # Varlık tipine özel componentler
│   │   ├── 🗂️ common/              # Ortak componentler
│   │   └── 🗂️ ui/                  # UI bileşenleri
│   └── 🗂️ lib/
│       ├── 📄 stellar.ts           # Stellar entegrasyonu
│       ├── 📄 contract.ts          # Contract işlemleri
│       └── 📄 asset-types.ts       # Varlık tipi tanımları
├── 🗂️ scripts/
│   ├── 📄 setup-project.ps1        # Proje kurulum scripti
│   ├── 📄 deploy-contract.ps1      # Contract deploy scripti
│   ├── 📄 test-all.ps1             # Tüm testleri çalıştır
│   └── 📄 customize-asset.ps1      # Varlık türü değiştir
└── 🗂️ docs/
    ├── 📄 ASSET_TYPES.md           # Desteklenen varlık türleri
    ├── 📄 API_REFERENCE.md         # API dokümantasyonu
    ├── 📄 COMPLIANCE_GUIDE.md      # Compliance rehberi
    └── 📄 EXAMPLES.md              # Örnek projeler
```

## 🎨 Varlık Türü Özelleştirmeleri

### 🏠 Gayrimenkul (Real Estate)
```typescript
// Özel alanlar
interface RealEstateMetadata {
  propertyType: "residential" | "commercial" | "industrial";
  location: string;
  squareMeters: number;
  propertyValue: number;
  rentalYield: number;
  propertyDocuments: string[]; // IPFS hash'leri
}
```

### 🌾 Tarım (Agriculture)
```typescript
// Özel alanlar
interface AgricultureMetadata {
  cropType: string;
  farmLocation: string;
  harvestSeason: string;
  expectedYield: number;
  farmCertifications: string[];
  weatherInsurance: boolean;
}
```

### 💎 Değerli Metaller (Precious Metals)
```typescript
// Özel alanlar
interface PreciousMetalMetadata {
  metalType: "gold" | "silver" | "platinum" | "palladium";
  purity: number; // 999, 950, etc.
  weight: number; // gram
  storageLocation: string;
  assayReport: string; // IPFS hash
  insuranceValue: number;
}
```

## 🔧 Kurulum Adımları

### 1. Gereksinimler
```powershell
# Stellar CLI
winget install --id=StellarDevelopmentFoundation.StellarCLI

# Rust
winget install --id=Rustlang.Rust.MSVC

# Node.js
winget install --id=OpenJS.NodeJS
```

### 2. Template'i İndir ve Özelleştir
```powershell
# Template klasörünü oluştur
mkdir rwa-template
cd rwa-template

# Kurulum scriptini çalıştır
.\scripts\setup-project.ps1 -AssetType "real_estate" -TokenSymbol "REAL" -ProjectName "RealToken"
```

### 3. Smart Contract'ı Deploy Et
```powershell
# Contract'ı build et
stellar contract build

# Testnet'e deploy et
.\scripts\deploy-contract.ps1 -Network testnet
```

### 4. Frontend'i Başlat
```powershell
cd frontend-template
npm install
npm run dev
```

## 📝 Özelleştirme Rehberi

### Yeni Varlık Türü Ekleme

1. **Smart Contract'ta yeni tip ekle:**
```rust
// src/types.rs
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum AssetType {
    Agriculture,
    RealEstate,
    PreciousMetals,
    YourNewType, // Yeni tip ekle
}
```

2. **Frontend'te yeni tip tanımla:**
```typescript
// lib/asset-types.ts
export const ASSET_TYPES = {
  agriculture: { name: "Agriculture", icon: "🌾" },
  real_estate: { name: "Real Estate", icon: "🏠" },
  precious_metals: { name: "Precious Metals", icon: "💎" },
  your_new_type: { name: "Your Asset", icon: "🎯" }, // Yeni tip
};
```

3. **Özel metadata alanları ekle:**
```typescript
interface YourNewTypeMetadata {
  customField1: string;
  customField2: number;
  // Varlık tipinize özel alanlar
}
```

## 🧪 Test Template'i

### Otomatik Test Scripti
```powershell
# Tüm testleri çalıştır
.\scripts\test-all.ps1

# Spesifik varlık türü testi
.\scripts\test-asset-type.ps1 -AssetType "real_estate"
```

### Manuel Test Adımları
```powershell
# 1. Anahtarları oluştur
stellar keys generate test_admin --network testnet
stellar keys generate test_user --network testnet

# 2. Contract test et
stellar contract invoke --id $CONTRACT_ID --source test_admin --network testnet -- get_metadata

# 3. Token mint et
stellar contract invoke --id $CONTRACT_ID --source test_admin --network testnet -- mint --to test_user --amount 100 --send=yes
```

## 📊 Örnek Projeler

### 1. 🏠 Emlak Tokenization
- **Kullanım**: Konut ve ticari gayrimenkul payları
- **Token**: REAL
- **Özellik**: Kira geliri dağıtımı

### 2. 🌾 Tarım Tokenization (Mevcut AgroToken)
- **Kullanım**: Çiftlik yatırımları ve hasat payları
- **Token**: AGRO
- **Özellik**: Hasat geliri dağıtımı

### 3. 💎 Altın Tokenization
- **Kullanım**: Fiziksel altın rezervleri
- **Token**: GOLD
- **Özellik**: Güvenli depolama ve sigorta

### 4. 🎨 Sanat Eseri Tokenization
- **Kullanım**: Değerli sanat eserlerinin fraksiyonel sahipliği
- **Token**: ART
- **Özellik**: Müze sergileme gelirleri

## 🔗 Faydalı Linkler

- [Stellar Docs](https://developers.stellar.org/)
- [Soroban Smart Contracts](https://developers.stellar.org/docs/smart-contracts)
- [Next.js Documentation](https://nextjs.org/docs)
- [RWA Tokenization Best Practices](https://stellar.org/blog/real-world-assets)

---

**Template Versiyonu**: 1.0  
**Son Güncelleme**: 7 Haziran 2025  
**Hazırlayan**: RWA Template Generator

## 🤝 Katkıda Bulunma

Bu template'i geliştirmek için:
1. Fork yapın
2. Yeni özellik ekleyin
3. Pull request gönderin

## 📄 Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
