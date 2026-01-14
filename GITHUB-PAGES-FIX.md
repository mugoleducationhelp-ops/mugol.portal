# GitHub Pages PWA 404 Hatası Çözümü

## 🔴 Sorun
Telefondan uygulamayı açtığınızda "404 dosya bulunamadı" hatası alıyorsunuz.

## ✅ Çözümler

### Adım 1: Hangi Dosyaları Kullanmalısınız?

**Senaryo A: Doğrudan GitHub Pages kullanıyorsanız** (örn: `username.github.io`)
- `index.html` ✓
- `manifest.json` ✓
- `service-worker.js` ✓

**Senaryo B: Alt dizin kullanıyorsanız** (örn: `username.github.io/mugol-portal`)
- `index.html` ✓
- `manifest.json` ✓
- `service-worker-subdir.js` → bunu `service-worker.js` olarak kaydedin ✓

---

### Adım 2: GitHub Repository Ayarları

1. Repository'nize gidin
2. **Settings** → **Pages**
3. **Source**: `main` branch veya `gh-pages` branch seçin
4. **Folder**: `/ (root)` seçin
5. **Save** butonuna basın

---

### Adım 3: Dosya Konumları Kontrol

Tüm dosyalar repository'nin **kök dizininde** olmalı:

```
username.github.io/
├── index.html
├── manifest.json
├── service-worker.js
├── icon-192.png (oluşturmalısınız)
├── icon-512.png (oluşturmalısınız)
└── logo.png (opsiyonel)
```

**ÖNEMLİ:** Alt klasörlere (docs/, src/, vb.) koymayın!

---

### Adım 4: Icon Dosyaları Oluşturma

PWA için icon dosyalarınız olmalı. Yoksa şu şekilde oluşturabilirsiniz:

#### Seçenek 1: Online Araçlar
1. https://realfavicongenerator.net/ adresine gidin
2. Bir logo yükleyin
3. 192x192 ve 512x512 boyutlarında icon indirin
4. `icon-192.png` ve `icon-512.png` olarak kaydedin

#### Seçenek 2: Placeholder Icon
Geçici olarak tek renkli icon kullanabilirsiniz:
```html
<!-- Tarayıcı console'unda çalıştırın -->
<canvas id="c" width="192" height="192"></canvas>
<script>
const ctx = c.getContext('2d');
ctx.fillStyle = '#4A90E2';
ctx.fillRect(0,0,192,192);
ctx.fillStyle = 'white';
ctx.font = 'bold 80px Arial';
ctx.textAlign = 'center';
ctx.fillText('MG', 96, 115);
c.toBlob(b => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = 'icon-192.png';
  a.click();
});
</script>
```

---

### Adım 5: HTTPS Kontrolü

PWA'lar **sadece HTTPS** üzerinde çalışır!

- GitHub Pages otomatik HTTPS sağlar ✓
- Ama `http://` ile açarsanız çalışmaz ✗
- Mutlaka `https://username.github.io` kullanın ✓

---

### Adım 6: Cache Temizleme

Eğer hala 404 alıyorsanız:

#### Telefonda (Chrome)
1. Chrome ayarlarını açın
2. **Gizlilik ve güvenlik**
3. **Site ayarları**
4. Sitenizi bulun
5. **Depolama ve izinler** → **Verileri temizle**

#### Telefonda (Safari - iOS)
1. **Ayarlar** → **Safari**
2. **Gelişmiş** → **Website Verileri**
3. Sitenizi bulup silin

---

### Adım 7: Service Worker'ı Manuel Test

Chrome DevTools'da test edin:

1. `https://username.github.io` adresini açın
2. **F12** veya **Sağ tık → İncele**
3. **Application** sekmesi
4. Sol menüden **Service Workers**
5. "Service Worker kayıt başarılı" yazmalı ✓

---

## 🔍 Yaygın Hatalar ve Çözümleri

### Hata 1: "Failed to register service worker"
**Neden:** HTTP üzerinden açmaya çalışıyorsunuz
**Çözüm:** `https://` ile açın

### Hata 2: "Manifest is not valid JSON"
**Neden:** manifest.json'da syntax hatası var
**Çözüm:** JSON validator kullanın: https://jsonlint.com/

### Hata 3: "Service Worker registration failed: (404)"
**Neden:** service-worker.js dosyası yanlış yolda
**Çözüm:** Dosya repository kök dizininde olmalı

### Hata 4: Icons bulunamıyor
**Neden:** Icon dosyaları yok veya yanlış isimde
**Çözüm:** `icon-192.png` ve `icon-512.png` oluşturun

---

## 📱 Telefona Yükleme

### Android (Chrome)
1. Siteyi açın: `https://username.github.io`
2. Chrome menüsü (⋮) → **Ana ekrana ekle**
3. **Ekle** butonuna basın

### iOS (Safari)
1. Siteyi açın: `https://username.github.io`
2. Paylaş butonu (□↑) → **Ana Ekrana Ekle**
3. **Ekle** butonuna basın

---

## 🚀 Son Kontrol Listesi

- [ ] Tüm dosyalar repository kök dizininde
- [ ] GitHub Pages etkin (Settings → Pages)
- [ ] `https://` ile açılıyor (HTTP değil!)
- [ ] Icon dosyaları mevcut (192x192 ve 512x512)
- [ ] manifest.json geçerli JSON formatında
- [ ] Service Worker kayıt başarılı (Console'da kontrol)
- [ ] Tarayıcı cache'i temizlendi
- [ ] 5-10 dakika bekledim (GitHub Pages yayınlanması için)

---

## 💡 Pro İpuçları

1. **GitHub Actions ile otomatik deploy:**
   - `.github/workflows/deploy.yml` dosyası oluşturun
   - Her commit'te otomatik yayınlansın

2. **Custom domain kullanıyorsanız:**
   - `CNAME` dosyası ekleyin
   - DNS ayarlarını yapın
   - SSL sertifikası aktif olsun

3. **Offline çalışmasını test edin:**
   - DevTools → Network → Offline
   - Sayfa hala açılabilmeli

---

## 🆘 Hala Çalışmıyor mu?

1. **Repository'yi public yapın** (private repo'lar farklı davranabilir)
2. **Farklı tarayıcıda deneyin** (Chrome, Firefox, Safari)
3. **Incognito/Gizli mod**da açın (cache sorunu varsa)
4. **Console hatalarını okuyun** (F12 → Console)
5. **GitHub Pages build loglarını kontrol edin** (Actions sekmesi)

---

## 📧 Destek

Hala sorun yaşıyorsanız, şu bilgileri paylaşın:
- GitHub Pages URL'iniz
- Tarayıcı console logları (F12 → Console)
- Hangi cihaz/tarayıcı kullandığınız
- Service Worker durumu (Application → Service Workers)

İyi çalışmalar! 🎉
