# GrasiApp — Dokumentasi Arsitektur & Keputusan Proyek

> **Status:** Keputusan awal (fase diskusi)  
> **Terakhir diperbarui:** 25 Mei 2026  
> **Paket template terpilih:** Opsi 1 — Modern Agency

---

## 1. Ringkasan Proyek

Aplikasi **company profile** berbasis **Next.js** dengan:

| Area | Deskripsi |
|------|-----------|
| **Landing (public)** | Halaman marketing perusahaan, konten dari database |
| **Admin** | Panel CRUD untuk mengelola konten tanpa coding ulang |
| **Bahasa** | Indonesia (`/id`) + English (`/en`) |
| **Konten** | Dinamis — semua isi utama disimpan di DB |
| **Hosting** | Server aktif sendiri (bukan wajib Vercel) |
| **Integrasi** | Email (form kontak) + WhatsApp (link / notifikasi) |
| **Konten bisnis** | **ItProject** (+ **ItCategory**), **CharityProject**, **TranslatorService** |
| **Bio page** | Halaman mirip Linktree per user (slug, tema, background, link) |
| **Akses** | User + Role (RBAC) di admin |

**Skema database (draft):** [docs/SCHEMA-DB.md](./SCHEMA-DB.md)

---

## 2. Keputusan: Opsi 1 — Modern Agency

Kombinasi template dan fondasi teknis yang disepakati:

```
[Landing UI]     agency-kit-site
       +
[Admin UI]       next-shadcn-admin-dashboard
       +
[i18n]           next-intl (locale: id, en)
       +
[DB + konten]    Prisma + PostgreSQL
```

### Alasan pemilihan

- Landing dan admin sama-sama memakai **shadcn/ui** → konsistensi visual dan komponen.
- Landing sudah berstruktur untuk agency/company (hero, section, SEO).
- Admin menyediakan layout dashboard, tabel, form — siap dihubungkan ke CRUD DB.
- **next-intl** standar untuk App Router + routing `/id` dan `/en`.
- **Prisma + PostgreSQL** cocok untuk konten dinamis dan deploy di server sendiri.

---

## 3. Template Referensi

### 3.1 Landing — agency-kit-site

| Item | Detail |
|------|--------|
| **Repo** | https://github.com/pinak3748/agency-kit-site |
| **Demo** | https://agency-starter.netlify.app/ |
| **Stack** | Next.js 15, Tailwind CSS, shadcn/ui, TypeScript, GSAP |
| **Lisensi** | MIT |
| **Peran** | UI/section halaman public (hero, layanan, dll.) |

**Catatan adaptasi:** Konten saat ini static/MDX → diganti dengan data dari database/API.

```bash
# Preview lokal (referensi)
git clone https://github.com/pinak3748/agency-kit-site.git
cd agency-kit-site && npm i && npm run dev
```

### 3.2 Admin — next-shadcn-admin-dashboard

| Item | Detail |
|------|--------|
| **Repo** | https://github.com/arhamkhnz/next-shadcn-admin-dashboard |
| **Demo** | https://next-shadcn-admin-dashboard.vercel.app |
| **Vercel template** | https://vercel.com/templates/next.js/next-js-and-shadcn-ui-admin-dashboard |
| **Stack** | Next.js 16, shadcn/ui, Tailwind v4, TanStack Table, React Hook Form, Zod |
| **Lisensi** | MIT |
| **Peran** | Layout `/admin`, sidebar, tabel data, form input |

**Catatan adaptasi:** Auth disesuaikan ke kebutuhan (Auth.js / credentials) — hindari ketergantungan cloud jika ingin full self-host.

```bash
# Preview lokal (referensi)
git clone https://github.com/arhamkhnz/next-shadcn-admin-dashboard.git
cd next-shadcn-admin-dashboard && npm i && npm run dev
```

### 3.3 i18n — next-intl

| Item | Detail |
|------|--------|
| **Dokumentasi** | https://next-intl.dev/docs/getting-started/app-router |
| **Boilerplate referensi** | https://github.com/LeonZeng919/next-shadcn-intl-template |
| **Locale** | `id` (default), `en` |
| **Routing** | Prefix: `/id/...`, `/en/...` |

**Pola routing:**

```
/id              → home (Bahasa Indonesia)
/en              → home (English)
/id/about
/en/about
/admin           → tanpa prefix bahasa
```

### 3.4 Section modular (opsional)

| Sumber | URL |
|--------|-----|
| shadcn/ui Blocks | https://ui.shadcn.com/blocks |

Digunakan bila perlu menambah section tanpa mengambil dari repo landing penuh.

---

## 4. Stack Teknis Lengkap

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Next.js (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| i18n | next-intl |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth admin | Auth.js (rencana) — atau sesuai kebutuhan self-host |
| Email | Resend atau Nodemailer + SMTP |
| WhatsApp | `wa.me` link (fase 1); API gateway (fase 2, opsional) |
| Animasi landing | GSAP (dari agency-kit-site, jika dipertahankan) |

---

## 5. Kebutuhan Fungsional

### 5.1 Public (landing)

- Home, About, Services, Portfolio/Work, Team, Contact
- Blog/berita (opsional — fase 2)
- SEO: metadata, Open Graph, sitemap, `robots.txt`
- Semua teks utama dari DB (bukan hardcode di komponen)
- Dukungan bilingual per field konten

### 5.2 Admin (`/admin`)

- Login — **User + Role** (RBAC, permission granular)
- Dashboard ringkasan
- CRUD: halaman CMS, **ItProject**, **CharityProject**, **TranslatorService**
- **Bio page** — 1 per user; hanya user dengan permission `bio_page.access`
- Media library (upload gambar, alt text ID/EN)
- Site settings: logo, kontak, sosial media, footer
- Manajemen user & role (super_admin)
- Form kontak: daftar pesan masuk
- Draft / publish
- Preview sebelum publish (rencana)

### 5.4 Bio page (Linktree) — public

- URL: `/u/[slug]` (contoh: `domain.com/u/andi`)
- Kustom: daftar link, tema, background (warna/gradient/gambar), gaya tombol
- Pemilik: max **1 bio per user**; akses via permission `bio_page.access` (dibuka admin)
- Detail schema: [SCHEMA-DB.md](./SCHEMA-DB.md) §5

### 5.3 Konten & bilingual di database

**Pendekatan disarankan (fase awal):** kolom ganda per entitas.

```text
title_id, title_en
body_id, body_en
description_id, description_en
```

**Admin UI:** tab atau toggle "Indonesia" | "English" per form.

**Yang perlu bilingual:** judul, deskripsi, body, SEO, alt gambar, label CTA.  
**Slug:** konsisten (`about`) atau terpisah per locale — putuskan saat implementasi schema.

---

## 6. Struktur Aplikasi (rencana)

```text
grasiapp/
├── app/
│   ├── [locale]/              # public: id, en
│   │   ├── page.tsx           # home
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   └── ...
│   ├── admin/                 # panel admin (tanpa locale)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── team/
│   │   ├── media/
│   │   └── messages/          # inbox form kontak
│   └── api/                   # atau Server Actions
├── components/
│   ├── ui/                    # shadcn
│   ├── marketing/             # dari agency-kit-site (diadaptasi)
│   └── admin/                 # dari admin dashboard (diadaptasi)
├── lib/
│   ├── db/                    # Prisma client
│   └── auth/
├── messages/                  # next-intl JSON (UI shell, bukan konten CMS)
│   ├── id.json
│   └── en.json
├── prisma/
│   └── schema.prisma
└── docs/
    └── ARSITEKTUR.md          # dokumen ini
```

---

## 7. Integrasi Email & WhatsApp

### Email

1. User submit form kontak di `/id/contact` atau `/en/contact`
2. Validasi server-side (Zod)
3. Simpan ke tabel `ContactMessage` (opsional tapi disarankan)
4. Kirim notifikasi ke email perusahaan (Resend / SMTP)

### WhatsApp

| Fase | Implementasi |
|------|----------------|
| **Fase 1** | Tombol "Chat kami" → `https://wa.me/{nomor}?text=...` (nomor dari site settings di DB) |
| **Fase 2** | Notifikasi otomatis via WhatsApp Business API / gateway pihak ketiga (opsional) |

---

## 8. Deploy di Server Aktif

```text
[Nginx/Caddy] → reverse proxy + SSL
       ↓
[Next.js]     → next build && next start (atau PM2/systemd)
       ↓
[PostgreSQL]  → DB di server yang sama atau terpisah
```

**Persyaratan server:**

- Node.js 20+
- RAM cukup untuk build (disarankan ≥ 2 GB)
- Environment: `DATABASE_URL`, secret auth, kunci API email

**Env contoh (belum final):**

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
# atau RESEND_API_KEY=
```

---

## 9. Roadmap Implementasi

### Fase 1 — Fondasi

- [ ] Scaffold monorepo Next.js di `grasiapp`
- [ ] Integrasi struktur landing (agency-kit-site) + layout admin
- [ ] Setup Prisma + PostgreSQL + migrasi awal
- [ ] Setup next-intl (`id`, `en`)
- [ ] Auth admin dasar

### Fase 2 — Landing MVP

- [ ] Home, About, Contact — data dari DB
- [ ] Form kontak + simpan DB + kirim email
- [ ] Link WhatsApp dari settings

### Fase 3 — Admin MVP

- [ ] CRUD halaman & layanan
- [ ] Upload media
- [ ] Site settings
- [ ] Inbox pesan kontak

### Fase 4 — Polish

- [ ] Portfolio, tim, blog (jika perlu)
- [ ] Draft/publish, preview
- [ ] SEO lengkap, sitemap per locale
- [ ] ISR/cache untuk performa

---

## 10. Opsi yang Tidak Dipilih (arsip keputusan)

| Opsi | Alasan tidak dipilih saat ini |
|------|-------------------------------|
| Opsi 2 — Corporate formal | User memilih Opsi 1 (modern agency) |
| Opsi 3 — Build modular only | Butuh template landing+admin siap lebih cepat |
| Opsi 4 — Payload CMS | Admin custom + Prisma dipilih untuk kontrol penuh di satu app |
| Headless CMS (Strapi/Sanity) | Self-host + satu codebase Next.js lebih sederhana untuk skala ini |

---

## 11. Checklist Lisensi Template

| Template | Lisensi | Komersial |
|----------|---------|-----------|
| agency-kit-site | MIT | ✅ |
| next-shadcn-admin-dashboard | MIT | ✅ |
| next-intl | MIT | ✅ |
| shadcn/ui | MIT | ✅ |

---

## 12. Langkah Berikutnya

1. Clone/referensi kedua template untuk audit komponen yang akan dipindah.
2. Finalkan & implementasi schema Prisma — lihat [SCHEMA-DB.md](./SCHEMA-DB.md) (Project, User/Role, BioPage, Page, Media, …).
3. Scaffold proyek `grasiapp` dengan next-intl + struktur `[locale]` + `/admin`.
4. Hubungkan halaman public ke query DB per locale.

---

## 13. Referensi Cepat

| Sumber | URL |
|--------|-----|
| Landing template | https://github.com/pinak3748/agency-kit-site |
| Admin template | https://github.com/arhamkhnz/next-shadcn-admin-dashboard |
| next-intl docs | https://next-intl.dev/ |
| shadcn blocks | https://ui.shadcn.com/blocks |
| Prisma docs | https://www.prisma.io/docs |

---

*Dokumen ini menjadi acuan tim saat memulai development. Perbarui bagian Roadmap dan schema saat implementasi dimulai.*
