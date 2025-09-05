# Adet × Fiyat Hesaplayıcı

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


