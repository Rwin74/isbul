# Günlük İş

Türkiye'de şehir ve sektör bazında günlük iş ilanları ve çalışan başvuruları.
Next.js 16, Node.js 24, Turso (kalıcı SQLite), e-posta/şifre oturumu.

## Vercel kurulumu

1. Turso'da boş bir veritabanı oluştur. Veritabanı URL'sini ve bu veritabanına ait token'ı al: https://docs.turso.tech/quickstart
2. Vercel → projen → Settings → Environment Variables bölümüne aşağıdaki değerleri ekle (Production ve kullanıyorsan Preview):

| Değişken | Değer |
| --- | --- |
| `TURSO_DATABASE_URL` | Turso veritabanı adresi (`libsql://...turso.io`) |
| `TURSO_AUTH_TOKEN` | Veritabanının erişim token'ı |
| `SESSION_SECRET` | En az 32 karakterli rastgele gizli değer |

Güvenli bir oturum anahtarı üretmek için: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
Bu değerleri GitHub'a yükleme; `NEXT_PUBLIC_` öneki ekleme.

3. Turso SQL konsolunda `drizzle/0000_last_hammerhead.sql` ve ardından `drizzle/0001_gray_bruce_banner.sql` dosyalarını birer kez çalıştır. Alternatif: yerelde `.env.example` dosyasını `.env.local` olarak kopyala, gerçek değerleri gir ve `npm run db:setup` çalıştır. Bu komut yalnızca boş veritabanında ilk kurulum içindir; mevcut tabloları silmez. Yarıda kalırsa tamamlanan SQL'i tekrar çalıştırma; kalan ifadelerden devam et.
4. Vercel ayarları: Framework **Next.js**, Root Directory depo kökü, Node.js **24.x**. `vercel.json` build komutunu `npm run build`, çıktı dizinini `.next` olarak belirler. Önceden tanımladığın `dist` çıktı ayarını kaldır.
5. Son `main` commit'ini **Redeploy** et. İlk açılışta **Giriş / Kayıt → Kayıt ol** ile hesap oluştur.

Veritabanı bilgileri olmadan derleme başarılı olur; ilan ve hesap işlemleri kurulum eksik uyarısı verir. Veriler bellek veya tarayıcıda taklit edilmez.

## Yerelde çalıştırma

Node.js 24 ile `npm ci`, ardından yukarıdaki veritabanı ayarları ve `npm run dev`.
Tarayıcıda http://localhost:3000 adresini aç.
Üretim kontrolü: `npm run build` ve `npm start`.
Testler: `npm test`.

## Özellikler

- 81 il ve sektör filtreleri; eleman ve iş arayan ilanları.
- İlan oluşturma, başvuru/iş teklifi gönderme, başvuruları yalnızca ilan sahibinin görmesi.
- İlan kapatma ve tekrar başvuruyu engelleme.
- Şifreler salt ile scrypt kullanılarak saklanır; oturum HttpOnly imzalı çerezdir (7 gün). Giriş denemeleri sınırlıdır.
- E-posta doğrulama ve şifre sıfırlama henüz yoktur. E-posta, doğrulanmış kimlik olarak sunulmaz.

## Önceki Sites sürümü

Bu sürüm Vercel için hazırlanmıştır. Cloudflare D1 ve ChatGPT'nin ilettiği kimlik başlıklarına bağlı değildir; bu başlıklar kullanıcı kimliği olarak kabul edilmez. Eski Sites verileri ve hesapları yeni Turso veritabanına otomatik taşınmaz. Eski canlı Sites yayını bu değişiklikle güncellenmez.

Kaynaklar: https://vercel.com/docs/frameworks/full-stack/nextjs ve https://docs.turso.tech/sdk/http/reference
