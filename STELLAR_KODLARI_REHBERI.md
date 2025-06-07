# ⭐ Stellar CLI Komutları - Detaylı Açıklamalar ve Örnekler

Bu rehber, Stellar CLI'ın tüm önemli komutlarını detaylı açıklamalar ve pratik örneklerle anlatır.

## 📦 Kurulum ve Başlangıç

### Stellar CLI Kurulumu
```powershell
# Windows için (PowerShell)
winget install --id=StellarDevelopmentFoundation.StellarCLI

# Veya Cargo ile
cargo install --locked stellar-cli

# Kurulum kontrolü
stellar --version
```

## 🔑 Keys (Anahtar) Komutları

### `stellar keys ls`
**Açıklama**: Yerel olarak saklanan tüm anahtarları listeler
**Kullanım**: Hangi test hesaplarınızın olduğunu görmek için

```powershell
# Tüm anahtarları listele
stellar keys ls

# Örnek çıktı:
# alice
# bob  
# charlie
# admin
```

### `stellar keys generate`
**Açıklama**: Yeni keypair (public/private key çifti) oluşturur
**Kullanım**: Test hesapları oluşturmak için

```powershell
# Yeni anahtar oluştur
stellar keys generate alice --network testnet

# Farklı ağ için
stellar keys generate production-key --network mainnet

# Seed phrase ile oluştur
stellar keys generate alice --seed "your twelve word seed phrase here..."

# Örnek çıktı:
# Public key: GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
# Secret key: (gizli kalır)
```

### `stellar keys address`
**Açıklama**: Belirtilen anahtarın public address'ini gösterir
**Kullanım**: Komutlarda kullanmak için adresi almak

```powershell
# Alice'in adresini göster
stellar keys address alice

# Örnek çıktı:
# GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO

# PowerShell değişkenine kaydet
$aliceAddress = stellar keys address alice
echo "Alice adresi: $aliceAddress"
```

### `stellar keys fund`
**Açıklama**: Testnet hesabını XLM ile fonlar (sadece testnet)
**Kullanım**: Test için hesaba XLM yüklemek

```powershell
# Alice hesabını fonla
stellar keys fund alice --network testnet

# Örnek çıktı:
# Account GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO funded with 10000 lumens

# Fonlama sonrası kontrol
stellar account --account alice --network testnet
```

### `stellar keys rm`
**Açıklama**: Yerel anahtarı siler
**Kullanım**: Artık kullanılmayan test anahtarlarını temizlemek

```powershell
# Anahtarı sil
stellar keys rm old-test-key

# Onaylı silme
stellar keys rm old-test-key --yes
```

## 💰 Account (Hesap) Komutları

### `stellar account`
**Açıklama**: Hesap bilgilerini ve bakiyesini gösterir
**Kullanım**: XLM bakiyesi ve hesap durumunu kontrol etmek

```powershell
# Alice hesap bilgilerini göster
stellar account --account alice --network testnet

# Public key ile
stellar account --account GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO --network testnet

# Örnek çıktı:
# Account: GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO
# Balance: 9999.9999000 XLM
# Sequence: 12345678901234567
# Subentry Count: 0
```

## 📄 Contract (Kontrat) Komutları

### `stellar contract deploy`
**Açıklama**: Wasm contract'ını Stellar ağına deploy eder
**Kullanım**: Rust ile yazılan smart contract'ları ağa yüklemek

```powershell
# Contract deploy et
stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/rwa_token.wasm `
  --source alice `
  --network testnet

# Örnek çıktı:
# Contract deployed successfully!
# Contract ID: CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX
```

### `stellar contract invoke`
**Açıklama**: Deploy edilmiş contract'ın fonksiyonlarını çağırır
**Kullanım**: Contract ile etkileşim kurmak (en çok kullanılan komut)

```powershell
# Genel format
stellar contract invoke `
  --id CONTRACT_ID `
  --source SOURCE_ACCOUNT `
  --network NETWORK `
  -- FUNCTION_NAME `
  --parameter1 value1 `
  --parameter2 value2

# Balance sorgulama
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- balance `
  --address alice

# Örnek çıktı: "1000"

# Token transfer
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- transfer `
  --from alice `
  --to bob `
  --amount 100 `
  --send=yes

# Metadata sorgulama
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- get_metadata

# Örnek çıktı:
# {
#   "name": "AgroToken",
#   "symbol": "AGRO", 
#   "decimals": 0
# }
```

### `stellar contract bindings`
**Açıklama**: Contract için TypeScript/JavaScript binding'leri oluşturur
**Kullanım**: Frontend'de contract ile tip güvenli etkileşim

```powershell
# TypeScript bindings oluştur
stellar contract bindings typescript `
  --contract-id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --output-dir ./bindings `
  --network testnet

# JavaScript bindings oluştur
stellar contract bindings javascript `
  --contract-id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --output-dir ./js-bindings `
  --network testnet
```

### `stellar contract inspect`
**Açıklama**: Contract'ın fonksiyonlarını ve metadata'sını inceler
**Kullanım**: Contract'ın hangi fonksiyonları olduğunu öğrenmek

```powershell
# Contract fonksiyonlarını listele
stellar contract inspect `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --network testnet

# Örnek çıktı:
# Functions:
# - balance(address: Address) -> i128
# - transfer(from: Address, to: Address, amount: i128) -> Result<(), Error>
# - get_metadata() -> Metadata
# - mint(to: Address, amount: i128) -> Result<(), Error>
```

## 🌐 Network (Ağ) Komutları

### `stellar network ls`
**Açıklama**: Yapılandırılmış ağları listeler
**Kullanım**: Hangi ağların tanımlı olduğunu görmek

```powershell
# Tüm ağları listele
stellar network ls

# Örnek çıktı:
# testnet: https://soroban-testnet.stellar.org
# mainnet: https://soroban-mainnet.stellar.org
# futurenet: https://rpc-futurenet.stellar.org
```

### `stellar network add`
**Açıklama**: Yeni ağ yapılandırması ekler
**Kullanım**: Özel RPC endpoint'leri tanımlamak

```powershell
# Özel ağ ekle
stellar network add local `
  --rpc-url http://localhost:8000/soroban/rpc `
  --network-passphrase "Standalone Network ; February 2017"

# Testnet ağını yeniden ekle
stellar network add testnet `
  --rpc-url https://soroban-testnet.stellar.org `
  --network-passphrase "Test SDF Network ; September 2015"
```

## 🏗️ Build ve Deploy Komutları

### `stellar contract build`
**Açıklama**: Rust contract'ını Wasm formatında build eder
**Kullanım**: Contract kodunu deploy edilebilir hale getirmek

```powershell
# Contract'ı build et
stellar contract build

# Örnek çıktı:
# Building contract in /current/directory
# Optimizing wasm file...
# Build complete: target/wasm32-unknown-unknown/release/contract.wasm
```

### `stellar contract optimize`
**Açıklama**: Wasm dosyasını optimize eder (boyut küçültür)
**Kullanım**: Deploy maliyetini azaltmak

```powershell
# Wasm dosyasını optimize et
stellar contract optimize `
  --wasm target/wasm32-unknown-unknown/release/rwa_token.wasm

# Optimize edilmiş dosya: target/wasm32-unknown-unknown/release/rwa_token.optimized.wasm
```

## 📊 Proje Örnekleri

### 1. Yeni Proje Başlatma
```powershell
# Yeni Rust contract projesi
cargo new my-stellar-contract --lib
cd my-stellar-contract

# Cargo.toml'u düzenle (soroban dependencies ekle)
# src/lib.rs'de contract kodunu yaz

# Build et
stellar contract build

# Deploy et
stellar contract deploy `
  --wasm target/wasm32-unknown-unknown/release/my_stellar_contract.wasm `
  --source alice `
  --network testnet
```

### 2. Token Contract Test Senaryosu
```powershell
# Test anahtarları oluştur
stellar keys generate alice --network testnet
stellar keys generate bob --network testnet

# Hesapları fonla
stellar keys fund alice --network testnet
stellar keys fund bob --network testnet

# Contract ID'yi kaydet
$CONTRACT_ID = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"

# Alice'e token mint et
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- mint `
  --to alice `
  --amount 1000 `
  --send=yes

# Alice'in bakiyesini kontrol et
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- balance `
  --address alice

# Alice'den Bob'a transfer
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- transfer `
  --from alice `
  --to bob `
  --amount 100 `
  --send=yes

# Bob'un bakiyesini kontrol et
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- balance `
  --address bob
```

### 3. Multi-User Test Senaryosu
```powershell
# Çoklu kullanıcı oluştur
$users = @("alice", "bob", "charlie", "diana")

foreach ($user in $users) {
    stellar keys generate $user --network testnet
    stellar keys fund $user --network testnet
    Write-Host "$user oluşturuldu: $(stellar keys address $user)"
}

# Herkese token mint et
$CONTRACT_ID = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"

foreach ($user in $users) {
    stellar contract invoke `
      --id $CONTRACT_ID `
      --source alice `
      --network testnet `
      -- mint `
      --to $user `
      --amount 500 `
      --send=yes
    
    Write-Host "$user bakiyesi:"
    stellar contract invoke `
      --id $CONTRACT_ID `
      --source alice `
      --network testnet `
      -- balance `
      --address $user
}
```

## 🔧 Debugging ve Troubleshooting

### Log Seviyelerini Ayarlama
```powershell
# Detaylı log için
$env:RUST_LOG = "stellar_cli=debug"
stellar contract invoke --id ... --source ... --network ... -- function_name

# Daha fazla detay için
$env:RUST_LOG = "trace"
stellar contract invoke --id ... --source ... --network ... -- function_name
```

### Simulation vs Gerçek İşlem
```powershell
# Sadece simülasyon (varsayılan)
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- transfer --from alice --to bob --amount 10

# Gerçek işlem (blockchain'e yaz)
stellar contract invoke `
  --id $CONTRACT_ID `
  --source alice `
  --network testnet `
  -- transfer --from alice --to bob --amount 10 `
  --send=yes
```

### Hata Ayıklama
```powershell
# Contract fonksiyonlarını kontrol et
stellar contract inspect --id $CONTRACT_ID --network testnet

# Hesap durumunu kontrol et
stellar account --account alice --network testnet

# Network bağlantısını test et
Test-NetConnection soroban-testnet.stellar.org -Port 443
```

## 📋 Önemli Parametreler

### Genel Parametreler
- `--network`: Hangi ağ (testnet, mainnet, futurenet)
- `--source`: İşlemi imzalayacak hesap
- `--id`: Contract ID
- `--send=yes`: Simülasyon yerine gerçek işlem

### Address Formatları
- **Identity**: `alice` (yerel anahtar adı)
- **Public Key**: `GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO`
- **Contract ID**: `CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX`

### Data Tipleri
- **Address**: Stellar hesap adresi
- **i128**: 128-bit tam sayı (token miktarları için)
- **String**: Metin verisi
- **Boolean**: true/false değerleri

## 🎯 En Çok Kullanılan Komutlar

### Günlük Geliştirme
```powershell
# 1. Anahtarları listele
stellar keys ls

# 2. Bakiye kontrol et
stellar contract invoke --id $CONTRACT_ID --source alice --network testnet -- balance --address alice

# 3. Transfer yap
stellar contract invoke --id $CONTRACT_ID --source alice --network testnet -- transfer --from alice --to bob --amount 10 --send=yes

# 4. Contract fonksiyonlarını incele
stellar contract inspect --id $CONTRACT_ID --network testnet

# 5. Hesap durumunu kontrol et
stellar account --account alice --network testnet
```

### PowerShell Kısayolları
```powershell
# Değişkenler tanımla
$CONTRACT_ID = "CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX"
$ALICE = "alice"
$BOB = "bob"
$NETWORK = "testnet"

# Kısayol fonksiyonları
function Get-Balance($user) {
    stellar contract invoke --id $CONTRACT_ID --source $user --network $NETWORK -- balance --address $user
}

function Send-Tokens($from, $to, $amount) {
    stellar contract invoke --id $CONTRACT_ID --source $from --network $NETWORK -- transfer --from $from --to $to --amount $amount --send=yes
}

# Kullanım
Get-Balance alice
Send-Tokens alice bob 50
```

## 🚀 AgroToken Projesi Özel Komutları

Mevcut AgroToken projesine özel komutlar:

### Compliance İşlemleri
```powershell
# Compliance bilgisi sorgulama
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- get_compliance `
  --address alice

# Compliance ekleme (sadece admin)
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- add_compliance `
  --address bob `
  --data '{"kyc_verified":true,"accredited_investor":true,"jurisdiction":"US","compliance_expiry":1767225600}' `
  --send=yes

# Whitelist kontrolü
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- is_whitelisted `
  --address bob
```

### Test Kullanıcı Adresleri (Mevcut Proje)
```powershell
# Mevcut test kullanıcıları
$ALICE = "GCNBHES7OAVHZU7W5IJBACKRPC6GPW4S7VETH4DMQEYAYDSRWI467CRO"  # Admin
$BOB = "GD6EPCS4REEY5SUIZPRPYL3JKGAAM3QLVYLJHPKVSMOPRH6C36AXQHXZ"    # User

# Mevcut bakiyeleri kontrol et
stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- balance `
  --address alice

stellar contract invoke `
  --id CD22CFPEPDUXEBYLZ3LJA233UI5WRVQNT4UVWDKSOYONACWBQ5JMG5EX `
  --source alice `
  --network testnet `
  -- balance `
  --address bob
```

---

**💡 İpucu**: Bu komutları PowerShell'de çalıştırırken, uzun komutları `` ` `` (backtick) ile satırlara bölebilirsiniz.

**📝 Not**: Tüm örnekler Windows PowerShell için optimize edilmiştir. Linux/macOS kullanıcıları `\` kullanarak satır kırabilir ve `$()` syntax'ını kullanabilir.

**🔗 Faydalı Linkler**:
- [Stellar CLI Dokümantasyonu](https://developers.stellar.org/docs/tools/cli)
- [Soroban Smart Contracts](https://developers.stellar.org/docs/smart-contracts)
- [Stellar Expert](https://stellar.expert) - Blockchain explorer