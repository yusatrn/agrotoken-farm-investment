# 🌾 AgroToken Farm Investment Platform - Manuel Test Rehberi

Bu rehber, AgroToken platformunun tüm bileşenlerini manuel olarak test etmeniz için adım adım talimatlar içerir.

## ✅ Son Düzeltmeler (Haziran 2025)

**Frontend Bakiye Görüntüleme Sorunu Çözüldü:**
- ❌ **Eski durum**: Bob'un 304 tokeni "0 GVOF" olarak görünüyordu
- ✅ **Yeni durum**: Bob'un 304 tokeni "304 AGRO" olarak doğru görünüyor
- 🔧 **Düzeltme**: `formatTokenAmount` fonksiyonu, kontrat ondalık kullanmadığı için güncellendi
- 🏷️ **Sembol değişimi**: "GVOF" yerine doğru "AGRO" sembolü kullanılıyor

**Kontrat Entegrasyonu Doğrulandı:**
- Backend kontrat bağlantısı çalışıyor ✅
- Bakiye alma işlemi başarılı ✅
- Frontend formatlaması düzeltildi ✅

## 📋 Gereksinimler

Testlere başlamadan önce şunların yüklü olduğundan emin olun:

- **Stellar CLI** - `stellar --version` ile kontrol edin
- **Node.js 18+** - `node --version` ile kontrol edin
- **Freighter Wallet** - Tarayıcı uzantısı olarak
- **XLM Testnet hesabı** - Test ağında fon bulunan

## ⚠️ PowerShell Kullanıcıları İçin Önemli Not

Bu rehberdeki komutlar Linux/macOS için yazılmıştır. PowerShell kullanıyorsanız, aşağıdaki değişiklikleri yapın:

### Değişken Kullanımı
```bash
# Linux/macOS
$(stellar keys address alice)

# PowerShell
$aliceAddress = stellar keys address alice
# Sonra komutta: --address $aliceAddress
```

### ⚠️ Kritik Uyarı: Contract ID vs Kullanıcı Adresi
**Asla kullanıcı adresini contract ID olarak kullanmayın!**

```powershell
# ❌ YANLIŞ - Bob'un adresini contract ID olarak kullanmak
stellar contract invoke --id GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ --source bob --network testnet -- balance --address $bobAddress

# ✅ DOĞRU - Contract ID'yi kullanmak
stellar contract invoke --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX --source bob --network testnet -- balance --address $bobAddress
```

### Örnek PowerShell Komutu
```powershell
# Bakiye kontrol örneği
$aliceAddress = stellar keys address alice
stellar contract invoke --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX --source alice --network testnet -- balance --address $aliceAddress
```

## 🚀 Test Adımları

### 1. Çevre Kontrolü

```bash
# Stellar CLI kontrolü
stellar --version

# Node.js kontrolü
node --version

# Ağ bağlantısı kontrolü (PowerShell)
Test-NetConnection soroban-testnet.stellar.org -Port 443
```

### 2. Anahtar Kontrolü

```bash
# Mevcut anahtarları listele
stellar keys ls

# Eğer 'alice' anahtarı yoksa, oluştur
stellar keys generate alice --network testnet

# Alice'in public key'ini göster
stellar keys address alice
```

### 3. Hesap Finansmanı

```bash
# Alice hesabını fonla (sadece testnet için)
stellar keys fund alice --network testnet

# Hesabın fonlandığını kontrol et (basit bir contract query ile)
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- get_metadata
```

**📝 Not**: Eğer yukarıdaki komut çalışırsa, hesabınız başarıyla fonlanmış demektir.

### 4. Kontrat Durumu Kontrolü

Mevcut kontrat bilgileri:
- **Contract ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`
- **Admin Public Key**: `GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO`

```bash
# Kontrat metadata'sını kontrol et
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- get_metadata

# Kontrat admin'ini kontrol et
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- get_admin

# Token supply'ını kontrol et
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- get_total_supply
```

### 5. Bakiye Kontrolü

```bash
# Alice'in token bakiyesini kontrol et
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address alice)
```

### 6. Test Kullanıcıları Oluşturma

Platform testleri için birden fazla kullanıcı hesabı oluşturun:

```bash
# Farklı test kullanıcıları oluştur (otomatik fonlanır)
stellar keys generate alice --network testnet    # Ana test kullanıcısı
stellar keys generate bob --network testnet      # Transfer test kullanıcısı  
stellar keys generate charlie --network testnet  # Yatırım test kullanıcısı
stellar keys generate diana --network testnet    # Admin test kullanıcısı

# Not: Stellar CLI yeni versiyonlarda otomatik olarak hesapları fonluyor
# Eğer manuel fonlama gerekirse:
# stellar keys fund alice --network testnet
# stellar keys fund bob --network testnet
# stellar keys fund charlie --network testnet
# stellar keys fund diana --network testnet

# Oluşturulan adresleri göster ve kaydet
echo "Test Kullanıcı Adresleri:"
echo "Alice: $(stellar keys address alice)"
echo "Bob: $(stellar keys address bob)" 
echo "Charlie: $(stellar keys address charlie)"
echo "Diana: $(stellar keys address diana)"

# Adresleri dosyaya kaydet (opsiyonel)
echo "Alice: $(stellar keys address alice)" > test-addresses.txt
echo "Bob: $(stellar keys address bob)" >> test-addresses.txt
echo "Charlie: $(stellar keys address charlie)" >> test-addresses.txt
echo "Diana: $(stellar keys address diana)" >> test-addresses.txt
```

### 7. Test Kullanıcıları Oluşturma ve Token Minting

Platform testleri için birden fazla kullanıcı hesabı oluşturun:

```bash
# Admin yetkileriniz varsa, test kullanıcılarına token mint edin
# Bu adım sadece admin hesabından çalışır

# Alice'e token mint et (örnek: 100 token)
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- mint \
  --to $(stellar keys address alice) \
  --amount 100

# Bob'a token mint et (örnek: 50 token)  
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- mint \
  --to $(stellar keys address bob) \
  --amount 50

# Mint işlemi sonrası bakiyeleri kontrol et
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address alice)

stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address bob)
```

### 9. Token Transfer Testi

Artık önceden oluşturduğumuz test kullanıcıları arasında transfer yapalım:

```bash
# Alice'den Bob'a token transfer et (örnek: 5 token)
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- transfer \
  --from $(stellar keys address alice) \
  --to $(stellar keys address bob) \
  --amount 5

# Bob'dan Charlie'ye token transfer et (örnek: 3 token)
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source bob \
  --network testnet \
  -- transfer \
  --from $(stellar keys address bob) \
  --to $(stellar keys address charlie) \
  --amount 3

# Transfer sonrası tüm bakiyeleri kontrol et
echo "Transfer sonrası bakiyeler:"
echo "Alice bakiyesi:"
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address alice)

echo "Bob bakiyesi:"
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address bob)

echo "Charlie bakiyesi:"
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address charlie)
```

### 10. Frontend Test

```bash
# Frontend klasörüne git
cd rwa-frontend

# Bağımlılıkları yükle (ilk sefer)
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:3000` adresine gidin ve şunları test edin:

#### 10.1 Ana Sayfa Testi
- [ ] Sayfa yükleniyor mu?
- [ ] Freighter wallet bağlantısı çalışıyor mu?
- [ ] Dashboard görünüyor mu?

#### 10.2 Marketplace Testi
- [ ] `/marketplace` sayfası açılıyor mu?
- [ ] Farm listeleri görünüyor mu?
- [ ] Filtreleme çalışıyor mu?

#### 10.3 Yatırım Testi
- [ ] `/invest` sayfası açılıyor mu?
- [ ] Yatırım miktarı girişi çalışıyor mu?
- [ ] "Invest Now" butonu aktif mi?

#### 10.4 Transfer Testi
- [ ] `/transfer` sayfası açılıyor mu?
- [ ] Adres girişi çalışıyor mu?
- [ ] Miktar girişi çalışıyor mu?
- [ ] Transfer işlemi başlatılabiliyor mu?

#### 10.5 Admin Dashboard Testi
- [ ] `/admin-dashboard` sayfası açılıyor mu?
- [ ] Token minting kontrolü var mı?
- [ ] İşlem geçmişi görünüyor mu?

### 11. API Endpoint Testleri

### 11. API Endpoint Testleri

```bash
# Alice için mint tokens API testi (localhost:3000 çalışırken)
curl -X POST http://localhost:3000/api/mint-tokens \
  -H "Content-Type: application/json" \
  -d "{
    \"userAddress\": \"$(stellar keys address alice)\",
    \"tokenAmount\": \"10\"
  }"

# Bob için mint tokens API testi  
curl -X POST http://localhost:3000/api/mint-tokens \
  -H "Content-Type: application/json" \
  -d "{
    \"userAddress\": \"$(stellar keys address bob)\",
    \"tokenAmount\": \"15\"
  }"

# Admin kontrolü API testi
curl -X GET http://localhost:3000/api/check-admin

# Transaction durumu kontrolü
curl -X POST http://localhost:3000/api/check-transaction \
  -H "Content-Type: application/json" \
  -d '{
    "transactionHash": "TRANSACTION_HASH_HERE"
  }'

# Queue mint API testi (fallback mechanism)
curl -X POST http://localhost:3000/api/queue-mint \
  -H "Content-Type: application/json" \
  -d "{
    \"userAddress\": \"$(stellar keys address charlie)\",
    \"tokenAmount\": \"20\"
  }"
```

### 12. Auto-Minting Testi

1. Frontend'de `/invest` sayfasına gidin
2. Wallet'ınızı bağlayın
3. Bir yatırım miktarı girin (örn: 100 USDC)
4. "Invest Now" butonuna tıklayın
5. İşlem onaylandıktan sonra token'ların otomatik olarak hesabınıza yatırıldığını kontrol edin:

```bash
# Yatırım sonrası bakiye kontrolü
stellar contract invoke \
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX \
  --source alice \
  --network testnet \
  -- balance \
  --address $(stellar keys address alice)
```

## 🔍 Beklenen Sonuçlar

### ✅ Başarılı Test Sonuçları

- **Metadata Query**: Platform bilgileri döner (name, symbol, decimals)
- **Admin Query**: Admin public key döner
- **Supply Query**: Toplam token miktarı döner
- **Balance Query**: Kullanıcının token bakiyesi döner
- **Test Kullanıcıları**: Alice, Bob, Charlie, Diana hesapları oluşur
- **Token Minting**: Admin yetkileri ile token basılır
- **Multi-User Transfer**: Farklı kullanıcılar arası token transferi başarılı
- **Frontend**: Tüm sayfalar yüklenir ve çalışır
- **Auto-minting**: Yatırım sonrası token'lar otomatik gelir

### ❌ Olası Hatalar ve Çözümleri

**"Account not found" hatası:**
```bash
# Hesabı tekrar fonlayın
stellar keys fund alice --network testnet
```

**"Contract not found" hatası:**
- CONTRACT_ID doğru mu kontrol edin
- Network parametresi testnet mi kontrol edin

**Frontend bağlantı hatası:**
- Freighter wallet yüklü ve unlocked mi?
- Freighter'da testnet seçili mi?
- `.env.local` dosyası doğru mu?

**Auto-minting çalışmıyor:**
- Admin credentials `.env.local` dosyasında mı?
- API endpoints çalışıyor mu?

**Transfer işlemi başarısız:**
- Gönderen hesapta yeterli token var mı?
- Alıcı adresi doğru mu?

## 📊 Test Raporu Şablonu

Test tarihlerini ve sonuçları kaydetmek için:

```
Test Tarihi: ___________
Test Eden: _____________

✅/❌ Çevre Kontrolü
✅/❌ Anahtar Oluşturma  
✅/❌ Hesap Finansmanı
✅/❌ Kontrat Metadata
✅/❌ Kontrat Admin
✅/❌ Token Supply
✅/❌ Bakiye Kontrolü
✅/❌ Test Kullanıcıları Oluşturma
✅/❌ Token Minting (Admin)
✅/❌ Token Transfer (Çoklu Kullanıcı)
✅/❌ Frontend Ana Sayfa
✅/❌ Marketplace
✅/❌ Yatırım Sayfası
✅/❌ Transfer Sayfası
✅/❌ Admin Dashboard
✅/❌ API Endpoints
✅/❌ Auto-minting

Test Kullanıcıları:
Alice: ____________________
Bob: ______________________
Charlie: __________________
Diana: ____________________

Notlar:
_________________________________
_________________________________
_________________________________
```

## 🔗 Faydalı Linkler

- **Contract Explorer**: https://stellar.expert/explorer/testnet/contract/CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX
- **Stellar Laboratory**: https://laboratory.stellar.org
- **Freighter Wallet**: https://freighter.app
- **Stellar Testnet**: https://friendbot.stellar.org

---

**Son Güncelleme**: 7 Haziran 2025  
**Versiyon**: 1.0
