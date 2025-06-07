# 🚀 AgroToken - Hızlı Başlangıç Rehberi

## 5 Dakikada Platform Testine Başlayın!

### 1️⃣ Gerekli Araçları Kontrol Edin (1 dk)

```bash
# Bu komutlar çalışıyor mu kontrol edin:
stellar --version     # Stellar CLI kurulu mu?
node --version        # Node.js kurulu mu?
```

**Eğer kurulu değilse:**
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools) yükleyin
- [Node.js 18+](https://nodejs.org) yükleyin

### 2️⃣ Test Anahtarı Oluşturun (30 sn)

```bash
# Test anahtarı oluştur
stellar keys generate alice --network testnet

# Anahtarı fonla (ücretsiz testnet fonu)
stellar keys fund alice --network testnet
```

### 3️⃣ Kontratı Test Edin (1 dk)

```bash
# Kontrat bilgilerini görün
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- get_metadata

# Token bakiyenizi kontrol edin
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address alice)

# Whitelist durumunuzu kontrol edin
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- check_compliance \
  --address $(stellar keys address alice)
```

### 4️⃣ Frontend'i Başlatın (2 dk)

```bash
# Frontend klasörüne gidin
cd rwa-frontend

# Bağımlılıkları yükleyin (ilk sefer)
npm install

# Sunucuyu başlatın
npm run dev
```

### 5️⃣ Web Arayüzünü Test Edin (30 sn)

1. Tarayıcıda `http://localhost:3000` açın
2. [Freighter Wallet](https://freighter.app) kurun (eğer yoksa)
3. Wallet'da Testnet'e geçin
4. "Connect Wallet" butonuna tıklayın

## 🎉 Tebrikler!

Artık AgroToken platformunu test edebilirsiniz:

- **Dashboard**: Ana sayfa portföy bilgileri
- **Marketplace**: Yatırım fırsatları
- **Invest**: Yatırım yapma (auto-minting test)
- **Transfer**: Token transferi
- **Admin**: Yönetici paneli

## 🆘 Sorun mu Yaşıyorsunuz?

**Kontrat bulunamıyor hatası:**
```bash
# Ağ bağlantısını test edin
Test-NetConnection soroban-testnet.stellar.org -Port 443
```

**Frontend açılmıyor:**
```bash
# Port 3000 boş mu kontrol edin
netstat -an | findstr :3000
```

**Wallet bağlanmıyor:**
- Freighter yüklü ve açık mı?
- Testnet seçili mi?
- Hesapta XLM var mı?

## 📚 Detaylı Test İçin

Daha kapsamlı testler için: **[MANUEL_TEST_REHBERI.md](./MANUEL_TEST_REHBERI.md)**

---

**İpucu**: İlk defa mı? Önce `get_metadata` komutunu çalıştırın. Bu size kontratın çalıştığını gösterecek! 🌾
