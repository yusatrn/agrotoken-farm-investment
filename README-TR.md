# 🌾 AgroToken Çiftlik Yatırım Platformu

Stellar blockchain üzerinde inşa edilmiş kapsamlı bir tarımsal varlık tokenizasyonu ve yatırım platformu. Bu platform, çiftçilerin tarımsal varlıklarını tokenize etmelerini sağlar ve yatırımcıların blockchain teknolojisi aracılığıyla sürdürülebilir tarıma katılmalarına olanak tanır.

![AgroToken Platform](https://img.shields.io/badge/Platform-AgroToken_Farm_Investment-green)
![Blockchain](https://img.shields.io/badge/Blockchain-Stellar-brightgreen)
![Framework](https://img.shields.io/badge/Framework-Next.js_15-black)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 **Proje Genel Bakış**

AgroToken Çiftlik Yatırım Platformu, çiftlik varlıklarını Stellar blockchain üzerinde tokenize ederek tarımsal yatırımlara erişimi demokratikleştirir. Çiftçiler arazilerini satmadan finansmana erişebilir, yatırımcılar ise organik çiftlikler, süt işletmeleri, hayvancılık çiftlikleri ve gıda işleme tesisleri gibi tarımsal varlıkların kısmi sahipliğini satın alabilir.

### **🌟 Temel Özellikler**

#### **Çiftçiler İçin**
- 🚜 **Çiftlik Tokenizasyonu** - Tarımsal varlıkları ticareti yapılabilir çiftlik hisselerine dönüştürün
- 💰 **Sermayeye Erişim** - Çiftlik sahipliğini koruyarak finansman sağlayın
- 📋 **Uyumluluk Yönetimi** - Organik sertifikasyon ve tarımsal uyumluluk araçları
- 🌱 **Sürdürülebilirlik Odağı** - Organik ve sürdürülebilir tarım uygulamalarına destek

#### **Yeni Özellikler**
- ✨ **Otomatik Token Basımı** - Yatırım yapıldığında tokenler otomatik olarak yatırımcılara basılır
- 🔄 **Çok Katmanlı Basım Yaklaşımı** - Sunucu tarafı, kullanıcı cüzdanı ve arka plan kuyruk yedekleri
- 📊 **İşlem Durumu İzleme** - Token basım işlemleri için gerçek zamanlı durum güncellemeleri
- 🛡️ **Yönetici Paneli** - Token basım işlemlerini izleme ve yönetme

#### **Yatırımcılar İçin**
- 💼 **Çiftlik Portföy Paneli** - Gerçek zamanlı değerlemelerle tarımsal yatırımlara genel bakış
- 🏪 **Tarım Pazaryeri** - Çiftlik yatırım fırsatlarını keşfetme ve filtreleme
- 💸 **Güvenli Hisse Transferleri** - Uyumluluk doğrulaması ile çiftlik hisselerini gönderme/alma
- 📊 **Performans Takibi** - Verim, organik sertifikasyon durumu ve hasat projeksiyonlarını izleme
- 🔐 **Cüzdan Entegrasyonu** - Sorunsuz Freighter cüzdan bağlantısı

#### **Varlık Sahipleri (Çiftçiler) İçin**
- 🌱 **Çiftlik Listeleme Sihirbazı** - Tarımsal varlıkları tokenize etmek için 5 adımlı süreç
- 📋 **Tarımsal Uyumluluk** - Organik sertifikasyon ve yasal uyumluluk araçları
- 📈 **Finansman Yönetimi** - Yatırım hedefleri belirleme ve sermaye artırımını takip etme
- 🔒 **Yasal Çerçeve** - Arazi sahipliği doğrulaması ve yasal uyumluluk

#### **Platform Özellikleri**
- 🌾 **Çoklu Çiftlik Desteği** - Ekin arazileri, hayvancılık, süt çiftlikleri, gıda işleme
- ⚡ **Stellar Entegrasyonu** - Hızlı, düşük maliyetli blockchain işlemleri
- 🛡️ **Organik Uyumluluk** - Entegre organik sertifikasyon ve yatırımcı doğrulaması
- 📱 **Duyarlı Tasarım** - Tarımsal yatırımlar için optimize edilmiş profesyonel UI

---

## 🚀 **Hızlı Başlangıç**

### **Ön Koşullar**
- Node.js 18+ yüklü
- [Freighter Wallet](https://freighter.app/) tarayıcı uzantısı
- Geliştirme için Stellar Testnet erişimi

### **Kurulum**

```bash
# Repoyu klonlayın
git clone https://github.com/[KULLANICI_ADINIZ]/agrotoken-farm-investment.git
cd agrotoken-farm-investment

# Frontend dizinine gidin
cd rwa-frontend

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

AgroToken platformuna erişmek için `http://localhost:3000` adresini ziyaret edin.

### **Üretim Derlemesi**

```bash
# Üretim için derleyin
npm run build

# Üretim sunucusunu başlatın
npm start
```

---

## 🏗️ **Proje Mimarisi**

### **Teknoloji Yığını**

| Bileşen | Teknoloji | Amaç |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + TypeScript | React tabanlı web uygulaması |
| **Stil** | Tailwind CSS + shadcn/ui | Profesyonel UI bileşenleri |
| **Durum Yönetimi** | Zustand | Hafif durum yönetimi |
| **Blockchain** | Stellar SDK | Blockchain entegrasyonu |
| **Cüzdan** | Freighter API | Cüzdan bağlantısı |
| **İkonlar** | Lucide React | Profesyonel ikon sistemi |

### **Dizin Yapısı**

```
rwa-frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Panel (ana sayfa)
│   ├── marketplace/       # Varlık pazaryeri
│   ├── tokenize/          # Varlık tokenizasyon sihirbazı
│   ├── transfer/          # Token transfer arayüzü
│   ├── invest/            # Otomatik basım ile yatırım sayfası
│   ├── admin-dashboard/   # Yönetici izleme ve yönetim
│   ├── api/               # Otomatik basım için API uç noktaları
│   │   ├── mint-tokens/   # Sunucu tarafı token basımı
│   │   ├── queue-mint/    # Arka plan kuyruk işleme
│   │   ├── check-transaction/ # İşlem durumu izleme
│   │   └── check-admin/   # Yönetici yetki doğrulaması
│   ├── dashboard/         # Panel yönlendirme
│   ├── layout.tsx         # Kök düzen
│   └── globals.css        # Global stiller
├── components/
│   ├── ui/                # shadcn/ui bileşenleri
│   └── layout/            # Düzen bileşenleri
├── lib/
│   ├── types.ts           # TypeScript tanımları
│   ├── stellar.ts         # Stellar SDK yardımcıları
│   ├── contract.ts        # Otomatik basım ile akıllı kontrat istemcisi
│   ├── payment.ts         # Basım entegrasyonu ile ödeme işleme
│   └── utils.ts           # Yardımcı fonksiyonlar
├── stores/
│   ├── wallet.ts          # Cüzdan durum yönetimi
│   └── contract.ts        # Kontrat durum yönetimi
└── public/                # Statik varlıklar
```

---

## 💼 **Akıllı Kontrat Entegrasyonu**

### **Kontrat Detayları**
- **Kontrat ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Ağ**: Stellar Testnet
- **Varlık**: AgroToken Çiftlik Yatırımı (AGRO)
- **Tür**: Tarımsal varlık tokenizasyon platformu
- **Yönetici Genel Anahtarı**: `GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO`

### **Desteklenen İşlemler**

| İşlem | Açıklama | Durum |
|-----------|-------------|--------|
| `get_balance` | Kullanıcının token bakiyesini sorgula | ✅ Uygulandı |
| `get_metadata` | Varlık bilgilerini al | ✅ Uygulandı |
| `transfer` | Adresler arası token gönder | ✅ Uygulandı |
| `check_compliance` | KYC/beyaz liste durumunu doğrula | ✅ Uygulandı |
| `get_supply` | Toplam token arzını al | ✅ Uygulandı |
| `mint_simple` | Yeni token oluştur (otomatik) | ✅ Otomatik basım |
| `mint` | Yeni token oluştur (yönetici) | ✅ Uygulandı |
| `pause` | Kontrat işlemlerini duraklat | ✅ Sadece yönetici |

### **Varlık Metadata Yapısı**

```typescript
interface AssetMetadata {
  name: string;              // "AgroToken Çiftlik Yatırımı"
  symbol: string;            // "AGRO"  
  asset_type: string;        // "agricultural"
  description: string;       // "Tarımsal varlık tokenizasyon platformu"
  valuation: string;         // Mevcut USD değeri
  last_valuation_date: number; // Unix zaman damgası
  legal_doc_hash: string;    // Yasal dokümantasyon hash'i
}
```

---

## 🤖 **Otomatik Token Basım Sistemi**

AgroToken platformu, kullanıcılar yatırım yaptığında manuel yönetici müdahalesine ihtiyaç duymadan sofistike çok katmanlı otomatik token basım sistemi sunar.

### **Nasıl Çalışır**

1. **Birincil Yol - Sunucu Tarafı API Basımı**: `/api/mint-tokens` aracılığıyla yönetici kimlik bilgilerini kullanarak otomatik token basımı
2. **İkincil Yol - Doğrudan Kullanıcı Cüzdanı**: Yönetici ayrıcalıklarına sahip kullanıcılar için tokenler doğrudan basılır
3. **Yedek Yol - Arka Plan Kuyruğu**: Başarısız basımlar `/api/queue-mint` aracılığıyla işlenmek üzere kuyruğa alınır

### **Konfigürasyon**

Otomatik basımı etkinleştirmek için yöneticiler `.env.local` dosyasında aşağıdakileri yapılandırmalıdır:

```bash
# Kontrat Yönetici Kimlik Bilgileri
CONTRACT_ADMIN_PUBLIC_KEY=GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
CONTRACT_ADMIN_SECRET_KEY=GİZLİ_ANAHTARINIZI_BURAYA_GİRİN

# Stellar ağ konfigürasyonu
STELLAR_NETWORK=testnet

# API çağrıları için temel URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Dahili API güvenliği
INTERNAL_API_KEY=güvenli_dahili_api_anahtarınız_buraya
```

### **İzleme ve Yönetim**

- **Yönetici Paneli**: Basım işlemlerini izlemek için `/admin-dashboard` adresinde mevcut
- **İşlem Durumu**: Token basım işlemleri için gerçek zamanlı durum güncellemeleri
- **Hata İşleme**: Kapsamlı hata kurtarma ve kullanıcı geri bildirimi

### **Güvenlik Özellikleri**

- Yönetici kimlik bilgileri sadece sunucu tarafında güvenli şekilde saklanır
- API uç noktaları için çok katmanlı kimlik doğrulama
- Dahili API güvenliği ile arka plan işleme
- İşlem doğrulama ve durum izleme

---

## 🔗 **API Uç Noktaları ve Özellikler**

Platform, otomatik token basımı ve yönetimi için çeşitli API uç noktaları sağlar:

### **Otomatik Basım API'leri**

| Uç Nokta | Metot | Amaç | Durum |
|----------|--------|---------|--------|
| `/api/mint-tokens` | POST | Yönetici kimlik bilgileri ile sunucu tarafı token basımı | ✅ Aktif |
| `/api/queue-mint` | POST | Başarısız basımlar için arka plan kuyruk işleme | ✅ Aktif |
| `/api/check-transaction` | GET | İşlem durumu ve onay izleme | ✅ Aktif |
| `/api/check-admin` | GET | Cüzdanın yönetici ayrıcalıklarına sahip olup olmadığını doğrula | ✅ Aktif |

### **Kullanım Örnekleri**

#### **Otomatik Token Basımı**
```typescript
// Yatırım akışı otomatik olarak basımı tetikler
const response = await fetch('/api/mint-tokens', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    destinationAddress: kullaniciCuzdanAdresi,
    amount: tokenMiktari,
    source: 'investment'
  })
});
```

#### **İşlem Durumu İzleme**
```typescript
// İşlem durumunu kontrol et
const status = await fetch(`/api/check-transaction?hash=${txHash}`);
const result = await status.json();
```

### **Temel Platform Özellikleri**

#### **🤖 Akıllı Otomatik Basım**
- **Birincil**: Güvenli yönetici kimlik bilgileri kullanarak sunucu tarafı basımı
- **İkincil**: Ayrıcalıklı kullanıcılar için doğrudan kullanıcı cüzdanı basımı
- **Yedek**: Güvenilir işleme için arka plan kuyruk sistemi
- **İzleme**: Gerçek zamanlı durum güncellemeleri ve işlem takibi

#### **👨‍💼 Yönetici Paneli**
- **İşlem İzleme**: Bekleyen ve tamamlanan basım işlemlerini görüntüleme
- **Manuel Müdahale**: Otomatik sistemler başarısız olduğunda tokenları manuel olarak işleme
- **Sistem Sağlığı**: RPC bağlantısını ve sistem durumunu kontrol etme
- **Kullanıcı Yönetimi**: Yönetici ayrıcalıklarını doğrulama ve erişimi yönetme

#### **🎯 Yatırım Deneyimi**
- **Sorunsuz Akış**: Otomatik token teslimatı ile tek tıkla yatırım
- **Gerçek Zamanlı Geri Bildirim**: İşlem durumu güncellemeleri ve onayları
- **Hata Kurtarma**: Ağ veya sistem sorunlarının zarif işlenmesi
- **Portföy Entegrasyonu**: Token alındığında otomatik bakiye güncellemeleri

#### **🛡️ Güvenlik ve Uyumluluk**
- **Beyaz Liste Yönetimi**: Adres tabanlı erişim kontrolü
- **KYC Entegrasyonu**: İşlemlerden önce uyumluluk doğrulaması
- **Denetim İzi**: Tam işlem geçmişi ve günlükleme
- **Güvenli Depolama**: Yönetici kimlik bilgileri sadece sunucu tarafında korunur

---

## 📦 **Akıllı Kontrat - Dağıtıldı ve Aktif**

### **✅ Dağıtım Durumu**
- **Durum**: Başarıyla Dağıtıldı ve Başlatıldı
- **Tarih**: 5 Haziran 2025
- **Ağ**: Stellar Testnet
- **Kontrat Gezgini**: [Stellar Expert'te Görüntüle](https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX)

### **📋 Kontrat Bilgileri**
- **İlk Arz**: 1.000.000.000 AGRO token
- **Mevcut Değerleme**: $1.000,00
- **Yasal Dokümant Hash'i**: `QmYwAPJzv5CZsnA4qWkc2bGhJ2mGmbkVr8sxCTBCPLGSoL`
- **Kontrat Durumu**: Aktif (duraklatılmamış)

### **🔧 Yönetici Araçları**

Kontratla doğrudan etkileşime girmesi gereken yöneticiler için:

```powershell
# Kontrat işlevselliğini test et
.\test-contract.ps1 -ContractId CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX

# Otomatik basım konfigürasyonunu doğrula
.\verify-auto-minting.ps1

# Manuel token basımı (otomatik basım başarısız olursa)
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"

# Yeni kullanıcı adresini beyaz listeye ekle
.\whitelist-user.ps1 -UserAddress "G..."
```

### **📖 Ek Dokümantasyon**
- **Dağıtım Detayları**: `DEPLOYMENT_COMPLETE.md` dosyasına bakın
- **Otomatik Basım Kurulumu**: `AUTO_MINTING_CONFIG.md` dosyasına bakın
- **Yönetici Kılavuzu**: `ADMIN_MINT_GUIDE.md` dosyasına bakın
- **Kullanım Örnekleri**: `USAGE_GUIDE.md` dosyasına bakın

---

## 🚀 **Platform Durumu ve Başlangıç**

### **✅ Üretime Hazır Özellikler**
- ✅ **Akıllı Kontrat Dağıtıldı** - Tam işlevsellik ile Stellar Testnet'te canlı
- ✅ **Otomatik Token Basımı** - Sunucu tarafı, kullanıcı cüzdanı ve kuyruk yedekleri ile çok katmanlı sistem
- ✅ **Gerçek Blockchain Entegrasyonu** - Gerçek Stellar işlemleri ile Freighter cüzdan entegrasyonu
- ✅ **Yönetici Paneli** - Tam izleme ve yönetim arayüzü
- ✅ **Yatırım Akışı** - Otomatik token teslimatı ile uçtan uca yatırım süreci
- ✅ **Hata İşleme** - Kapsamlı hata kurtarma ve kullanıcı geri bildirimi
- ✅ **İşlem İzleme** - Gerçek zamanlı durum güncellemeleri ve işlem takibi

### **🎯 Hızlı Başlangıç Kılavuzu**

#### **Kullanıcılar İçin**
1. **Freighter Cüzdan Yükle**: [freighter.app](https://freighter.app/) adresinden indirin
2. **Testnet'e Geç**: Freighter'ı Stellar Testnet için yapılandırın
3. **Cüzdanınızı Fonlayın**: [Stellar Laboratory](https://laboratory.stellar.org/#account-creator)'den testnet XLM alın
4. **Yatırım Yapmaya Başlayın**: `http://localhost:3000` adresindeki platformu ziyaret edin

#### **Geliştiriciler İçin**
```powershell
# Frontend'i klonlayın ve kurun
cd rwa-frontend
npm install
npm run dev

# Platform http://localhost:3000 adresinde mevcut olacak
```

#### **Yöneticiler İçin**
```powershell
# Otomatik basımı yapılandırın (ilk kurulum)
# 1. .env.local dosyasını yönetici kimlik bilgilerinizle düzenleyin
# 2. Konfigürasyonu doğrulayın
.\verify-auto-minting.ps1

# 3. Platformu başlatın
cd rwa-frontend
npm run dev

# 4. Yönetici paneline http://localhost:3000/admin-dashboard adresinden erişin
```

### **🔧 Konfigürasyon**

#### **Ortam Kurulumu**
`rwa-frontend` dizininde `.env.local` dosyasını oluşturun veya güncelleyin:
```bash
# Otomatik basım için yönetici kimlik bilgileri
CONTRACT_ADMIN_PUBLIC_KEY=GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
CONTRACT_ADMIN_SECRET_KEY=GERÇEK_GİZLİ_ANAHTARINIZI_BURAYA_GİRİN

# Ağ konfigürasyonu
STELLAR_NETWORK=testnet
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# API güvenliği
INTERNAL_API_KEY=güvenli_api_anahtarınız_buraya
```

### **🎮 Platformu Test Etme**

#### **Yatırım Akışı Testi**
1. Freighter cüzdan bağlayın (testnet)
2. `/invest` sayfasına gidin
3. Yatırım miktarını seçin
4. Ödemeyi tamamlayın
5. Otomatik token basımını doğrulayın
6. Cüzdan bakiyenizi kontrol edin

#### **Yönetici Fonksiyonları Testi**
1. Yönetici cüzdanı ile bağlanın
2. `/admin-dashboard` sayfasına erişin
3. Bekleyen basım işlemlerini izleyin
4. Gerekirse manuel basımı test edin

### **📊 Platform Mimarisi**

| Bileşen | Durum | Amaç |
|-----------|--------|---------|
| **Akıllı Kontrat** | ✅ Dağıtıldı | Token yönetimi ve uyumluluk |
| **Frontend Uygulaması** | ✅ Hazır | Kullanıcı arayüzü ve cüzdan entegrasyonu |
| **Otomatik Basım API'leri** | ✅ Aktif | Otomatik token teslimat sistemi |
| **Yönetici Paneli** | ✅ Mevcut | İzleme ve yönetim |
| **Hata Kurtarma** | ✅ Uygulandı | Yedek sistemler ve kuyruk işleme |

---

## 📞 **Destek ve Sorun Giderme**

### **🔧 Yaygın Sorunlar ve Çözümler**

#### **Otomatik Basım Sorunları**
```powershell
# Otomatik basım konfigürasyonunu kontrol et
.\verify-auto-minting.ps1

# Otomatik basım uç noktalarını test et
.\test-auto-minting.ps1

# Otomatik başarısız olursa manuel token basımı
.\mint-tokens.ps1 -UserAddress "G..." -TokenAmount "100"
```

#### **Cüzdan Bağlantı Sorunları**
- Freighter cüzdanının yüklü ve açık olduğundan emin olun
- Freighter ayarlarında Stellar Testnet'e geçin
- Testnet hesabınızı XLM ile fonlayın

#### **İşlem Hataları**
- Stellar RPC'ye ağ bağlantısını kontrol edin
- Hesabın ücretler için yeterli XLM'ye sahip olduğunu doğrulayın
- Alıcı adresin beyaz listede olduğundan emin olun

#### **Yönetici Fonksiyonları**
- `.env.local` dosyasındaki yönetici kimlik bilgilerini doğrulayın
- Yönetici hesabının yeterli XLM'ye sahip olduğunu kontrol edin
- İşlemleri izlemek için yönetici panelini kullanın

### **📋 Doğrulama Araçları**

```powershell
# Genel sistem sağlığını kontrol et
.\verify-deployment.ps1

# Kontrat fonksiyonlarını test et
.\test-contract.ps1

# Otomatik basım sistemini kontrol et
.\check-auto-minting.ps1
```

### **📚 Dokümantasyon Kaynakları**

- **`AUTO_MINTING_CONFIG.md`** - Tam otomatik basım kurulum kılavuzu
- **`ADMIN_MINT_GUIDE.md`** - Yöneticiler için manuel basım prosedürleri
- **`DEPLOYMENT_COMPLETE.md`** - Detaylı dağıtım bilgileri
- **`USAGE_GUIDE.md`** - Platform kullanım örnekleri
- **`STELLAR_DEPLOYMENT_GUIDE.md`** - Kontrat dağıtım prosedürleri

### **🚨 Yardım Alma**

Sorunlarla karşılaştığınızda:

1. **Konfigürasyonu Kontrol Edin**: Önce doğrulama scriptlerini çalıştırın
2. **Dokümantasyonu İnceleyin**: Yukarıdaki kapsamlı kılavuzlara bakın
3. **Ağ Durumunu Kontrol Edin**: Stellar testnet gecikme yaşayabilir
4. **Yönetici Desteği**: Operasyonel sorunlar için yönetici panelini kullanın
5. **Hata Günlükleri**: Detaylı hata bilgileri için konsol günlüklerini kontrol edin

**Platform Durumu**: ✅ Üretime Hazır  
**Otomatik Basım**: ✅ Tam Operasyonel  
**Akıllı Kontrat**: ✅ Dağıtıldı ve Aktif

---

## 🌱 **Vizyon ve Etki**

AgroToken Çiftlik Yatırım Platformu, geleneksel tarım ile modern blockchain teknolojisi arasındaki köprüyü kurarak şunları sağlar:

- **Çiftçiler İçin**: Çiftlik sahipliğini koruyarak küresel sermayeye erişim
- **Yatırımcılar İçin**: Şeffaf getirilerle sürdürülebilir tarıma doğrudan katılım
- **Endüstri İçin**: İzlenebilir tedarik zinciri ve sürdürülebilir tarım teşvikleri

---

<div align="center">

**🌾 Sürdürülebilir tarımın geleceği için ❤️ ile inşa edildi 🌾**

*"Çiftlikten blockchain'e - Yarının tarımı için sürdürülebilir yatırımlar yetiştiriyoruz"*

**[Canlı Demo](link) • [Dokümantasyon](link) • [Topluluk](link) • [İletişim](link)**

</div>

---

### 📄 **Lisans**

Bu proje MIT Lisansı altında lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

### 🤝 **Katkıda Bulunma**

Katkılar memnuniyetle karşılanır! Lütfen Pull Request gönderebilirsiniz. Büyük değişiklikler için, önce ne değiştirmek istediğinizi tartışmak için bir issue açın.

### ⭐ **Destek**

Bu projeyi yararlı buluyorsanız, lütfen GitHub'da bir yıldız ⭐ verin!
