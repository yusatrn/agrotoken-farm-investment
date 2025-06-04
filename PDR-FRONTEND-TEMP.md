# 🎨 Frontend Özelleştirme PDR Template

> **Workshop Katılımcısı İçin Talimatlar:** 
> Bu template'i kendi projeniz için özelleştirmek üzere aşağıdaki bölümleri doldurun. 
> `[BURAYA_GİRİN: açıklama]` formatındaki alanları kendi proje bilgilerinizle değiştirin.

## 📋 **Proje Bilgileri**

### **Seçilen Sektör**: Agriculture & Food Production
### **Platform Adı**: AgroToken Farm Investment
### **Ana Varlık Türü**: Agricultural lands, livestock farms, food production facilities
### **Hedef Kitle**: Farmers, Agricultural investors, Food industry professionals, Impact investors

---

## 🎯 **Platform Vizyonu**

### **Ana Konsept**
Agricultural asset tokenization platform that enables farmers to access funding without selling their land, allows investors to participate in sustainable agriculture, and creates transparency in the food supply chain through blockchain technology. The platform bridges traditional farming with modern investment opportunities.

### **Değer Önerisi**
- **Farmers**: Early stage funding, retain ownership, access to global investors, fair pricing for agricultural products
- **Investors**: Direct investment in agriculture sector, sustainable returns, portfolio diversification, impact investing
- **Food Industry**: Traceable supply chain, quality assurance, direct farmer partnerships, sustainable sourcing

---

## 🎨 **Görsel Kimlik Güncellemeleri**

### **Renk Paleti**
```css
/* Agriculture & Food Theme */
--primary: #4CAF50      /* Forest Green - Main agriculture color */
--secondary: #FFC107    /* Golden Yellow - Harvest/grain color */
--accent: #8D6E63       /* Brown - Soil/earth color */
--background: #F1F8E9   /* Light green - Fresh/natural feeling */
--foreground: #2E7D32   /* Dark green - Text color */
```

### **İkonlar ve Emojiler**
- **Ana Tema**: 🌾 🚜 🐄 🏭 📊 💰
- **Alt Kategoriler**: 🌽 🍅 🐖 🐔 🧀 🥛
- **İşlemler**: 📝 💰 📈 🔍 ✅ 🚀

### **Tipografi**
- **Başlıklar**: Inter
- **İçerik**: System fonts
- **Ton**: Natural, trustworthy, sustainable

---

## 📁 **Güncellenmesi Gereken Dosyalar**

### **🏠 Ana Sayfa (`app/page.tsx`)**

#### **Başlık ve Açıklama**
```typescript
// Güncellenmesi gereken içerik:
title: "AgroToken Farm Investment"
description: "Sustainable agriculture investment platform powered by blockchain technology"
```

#### **Dashboard Kartları**
```typescript
// Agriculture için metrik örnekleri:
"Portfolio Değeri" → "Farm Portfolio Value"
"Toplam Yatırım" → "Total Agricultural Investment" 
"Aktif Varlıklar" → "Active Farms"
"Compliance Status" → "Organic Certification Status"
```

#### **Hızlı Eylemler**
```typescript
// Platform ana eylemlerinizi belirleyin:
"Varlık Keşfet" → "Explore Farms"
"Token Transfer" → "Share Transfer"
"Tokenize Et" → "List Your Farm"
```

### **🏪 Marketplace (`app/marketplace/page.tsx`)**

#### **Arama ve Filtreler**
```typescript
// Agriculture için filtreler:
asset_type: ["cropland", "livestock", "dairy_farm", "food_processing"]
location: ["midwest", "california", "texas", "florida"]
category: ["organic", "conventional", "sustainable", "precision"]
certification: ["organic_certified", "fair_trade", "non_gmo", "animal_welfare"]
```

#### **Varlık Kartları**
```typescript
// Agriculture için örnek varlık kartı:
{
  name: "Green Valley Organic Farm",
  symbol: "GVOF",
  creator: "Johnson Family Farms - Iowa",
  date: "Harvest Season: 2025-09-15",
  specs: "250 acres, Organic Corn & Soybeans",
  price_per_token: "$50",
  total_supply: 10000,
  sold_percentage: 65
}
```

#### **Metrikler**
```typescript
// Platform istatistikleri:
"Toplam Varlık Değeri" → "Total Agricultural Assets Value"
"Aktif Yatırımcılar" → "Active Farm Investors"
"Tamamlanan İşlemler" → "Successful Harvests"
```

### **🌱 Tokenization (`app/tokenize/page.tsx`)**

#### **5 Adımlı Süreç**
```typescript
// Tokenization süreci agriculture için:

1. "Farm Information" 
   - Farm type, crop details, location, size
   
2. "Agricultural Details" 
   - Soil quality, irrigation system, equipment, livestock count
   
3. "Certifications & Documentation"
   - Land ownership, organic certificates, permits, insurance
   
4. "Investment Structure"
   - Funding goals, token pricing, revenue sharing, harvest projections
   
5. "Launch Farm Project"
   - Review, approval, marketplace listing, investor outreach
```

### **💸 Transfer (`app/transfer/page.tsx`)**

#### **Transfer Terminolojisi**
```typescript
// Transfer işlemlerinin terminolojisi:
"Token Transfer" → "Farm Share Transfer"
"Alıcı Adresi" → "New Farm Investor Address"
"Transfer Miktarı" → "Share Amount"
"Compliance Check" → "Agricultural Compliance Verification"
```

### **🎨 Layout (`app/layout.tsx`)**

#### **Metadata**
```typescript
export const metadata = {
  title: 'AgroToken - Sustainable Agriculture Investment Platform',
  description: 'Invest in agricultural projects through blockchain technology. Support sustainable farming and earn returns from agricultural assets.',
  icons: {
    icon: '/farm-favicon.ico',
  }
}
```

### **📱 Header (`components/layout/Header.tsx`)**

#### **Navigasyon Menüsü**
```typescript
// Menü öğeleri agriculture için:
"Dashboard" → "Farm Dashboard"
"Marketplace" → "Agricultural Marketplace"
"Tokenize" → "List Your Farm"
"Transfer" → "Share Transfer"
```

---

## 🔧 **Teknik Güncellemeler**

### **Type Definitions (`lib/types.ts`)**

```typescript
// Agriculture için tip tanımları:
export interface AgriculturalAsset {
  id: string;
  name: string;
  symbol: string;
  asset_type: 'cropland' | 'livestock' | 'dairy_farm' | 'food_processing';
  creator_info: {
    name: string;
    location: string;
    experience_years: number;
    certifications: string[];
  };
  asset_details: {
    farm_size_acres: number;
    primary_crops: string[];
    livestock_count: number;
    organic_certified: boolean;
  };
  timeline_info: {
    creation_date: string;
    planting_season: string;
    estimated_harvest: string;
    quality_grade: 'A' | 'B' | 'C';
  };
  financial: {
    funding_goal: number;
    current_funding: number;
    token_price: number;
    total_supply: number;
  };
}
```

### **Mock Data (`lib/contract.ts`)**

```typescript
// Agriculture için örnek veri:
const SAMPLE_AGRICULTURAL_ASSETS = [
  {
    id: 'farm-001-iowa-corn',
    name: 'Sunrise Corn Farm',
    symbol: 'SCF',
    asset_type: 'cropland',
    creator_info: {
      name: 'Miller Family Farm',
      location: 'Iowa, USA', 
      experience_years: 25,
      certifications: ['Organic Certified', 'Sustainable Agriculture']
    },
    asset_details: {
      farm_size_acres: 500,
      primary_crops: ['Corn', 'Soybeans'],
      livestock_count: 0,
      organic_certified: true
    },
    timeline_info: {
      creation_date: '2025-03-01',
      planting_season: '2025-05-15',
      estimated_harvest: '2025-10-01',
      quality_grade: 'A'
    },
    financial: {
      funding_goal: 250000,
      current_funding: 162500,
      token_price: 25,
      total_supply: 10000
    }
  }
];
```

---

<div align="center">

**🚀 🌾 Agriculture sektöründen blockchain'e köprü kuruyoruz! 🌾**

*"From farm to blockchain - Growing sustainable investments for tomorrow's agriculture"*

</div>

---

*Bu PDR template'i, workshop katılımcılarının kendi sektörlerinde RWA tokenization platformu oluşturmalarına rehberlik edecek şekilde tasarlanmıştır. Her sektör için özelleştirilebilir ve ölçeklenebilir bir yapı sunar.*
