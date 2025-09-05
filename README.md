# Adet × Fiyat Hesaplayıcı (Modüler + LocalStorage)

Basit, modüler, tamamen istemci taraflı bir hesaplayıcı. Her satırda **Adet** ve **Birim Fiyat** alanları vardır; sağda **Tutar** otomatik hesaplanır. Sağ üstte toplam görünür. **+20 Satır Ekle** ile blok halinde satır eklenir. **Sıfırla** tüm verileri temizler. Değerler **localStorage**'a kaydedilir; sayfayı yenileseniz de kalır.

## Özellikler
- **Mobil öncelikli tasarım**: küçük ekranlarda 2 sütun (Adet | Fiyat) + altta geniş Tutar rozeti; geniş ekranlarda 3 sütun.
- Modüler dosya yapısı: `src/utils.js`, `src/storage.js`, `src/ui.js`, `src/main.js`
- Yerel kalıcılık: `localStorage` ile satırlar ve değerler saklanır
- Enter/Done tuşu ile **önce sağa**, sonra **alttaki satıra** geçiş
- Son satırda Enter → otomatik 20 yeni satır ekler ve yeni blokta yazmaya devam edebilirsiniz
- Türkçe sayı biçimlendirme (2 ondalık)

## Dosya Yapısı
```
adet-fiyat-app/
├─ index.html
├─ src/
│  ├─ styles.css
│  ├─ main.js
│  ├─ ui.js
│  ├─ storage.js
│  └─ utils.js
└─ README.md
```

## VS Code ile Çalıştırma
### Yöntem A) Live Server eklentisi
1. VS Code → Extensions → **Live Server** kurun.
2. Proje klasörünü açın (`adet-fiyat-app`).
3. `index.html` dosyasını açıkken sağ alttan **Go Live**'a tıklayın.
4. Açılan yerel adreste (genelde `http://127.0.0.1:5500`) site çalışır.

### Yöntem B) Basit yerel sunucu (Python ile)
- Terminalde proje klasörüne gelin ve şu komutu çalıştırın:
  - Python 3: `python3 -m http.server 8080`
- Tarayıcıdan `http://localhost:8080` adresine gidin.

> Not: Dosyayı doğrudan çift tıklayıp açmak yerine basit bir yerel sunucuyla açmanız önerilir (özellikle modül importları için).

## Ücretsiz Yayına Alma
### 1) GitHub Pages
- İçi boş bir repo oluşturun (örn. `adet-fiyat`), bu klasörün içeriğini yükleyin.
- **Settings → Pages → Build and deployment**: “Deploy from a branch” seçin.
- Branch: `main`, Folder: `/ (root)` → **Save**.
- 1–2 dk içinde: `https://kullaniciadiniz.github.io/adet-fiyat/`

### 2) Netlify (Sürükle-Bırak)
- netlify.com → Sign up → “Add new site” → “Deploy manually”
- `index.html`'i içeren klasörü sürükleyip bırakın.

### 3) Vercel (GitHub Üzerinden)
- vercel.com → New Project → GitHub repo'yu içe aktar → Deploy.

## Özelleştirme İpuçları
- Para birimi biçimini değiştirmek için `utils.js` içindeki `Intl.NumberFormat` ayarını düzenleyin.
- Başlangıç satır sayısı `src/ui.js` içinde `INITIAL` sabitinde.

Keyifli kullanımlar!
