# GrasiApp

Company profile — landing page (ID/EN) + admin panel. Konten dari PostgreSQL.

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [docs/ARSITEKTUR.md](./docs/ARSITEKTUR.md) | Arsitektur, template, roadmap |
| [docs/SCHEMA-DB.md](./docs/SCHEMA-DB.md) | Skema database |

## Stack

- Next.js 16, TypeScript, Tailwind, shadcn/ui
- next-intl (`/id`, `/en`)
- Prisma + PostgreSQL
- NextAuth (credentials)

## Setup lokal

### 1. Environment

```bash
cp .env.example .env
```

Isi `DATABASE_URL` dan `AUTH_SECRET` (generate: `openssl rand -base64 32`).

### 2. Database

PostgreSQL harus berjalan. Contoh dengan Docker:

```bash
docker run -d --name grasiapp-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=grasiapp -p 5432:5432 postgres:16
```

```bash
npm run db:migrate
npm run db:seed
```

### 3. Dev server

```bash
npm run dev
```

- Situs: http://localhost:3000/id
- Login admin: http://localhost:3000/id/login (alias: `/login`, `/en/login`)

**Login seed:** `admin` atau `admin@grasiapp.local` / `admin123`

## Scripts

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Migrasi database |
| `npm run db:seed` | Seed data awal |

## Deploy (database)

Urutan yang disarankan:

```bash
npm run db:generate
npx prisma migrate deploy
npm run db:seed
```

**Catatan:** `migrate deploy` dan `db:seed` memakai `DATABASE_URL` yang sama. Untuk managed PostgreSQL (DigitalOcean, Neon, RDS), SSL otomatis diaktifkan untuk host remote. Jika perlu paksa: `DATABASE_SSL=true`.

Seed membutuhkan `tsx` (devDependency) — jalankan dengan `npm install` penuh, bukan `--omit=dev`, saat step seed di CI/deploy.

## Routing

| Path | Deskripsi |
|------|-----------|
| `/id`, `/en` | Landing bilingual (agency-style) |
| `/id/it`, `/id/charity`, `/id/translator` | Konten bisnis |
| `/u/[slug]` | Bio page (Linktree) — fase berikutnya |
| `/admin` | Panel admin + CRUD |

## Admin CRUD

| Modul | Path | Fitur |
|-------|------|--------|
| Kategori IT | `/admin/it-categories` | Tambah / edit / hapus |
| Proyek IT | `/admin/it-projects` | CRUD + kategori wajib |
| Charity | `/admin/charity` | CRUD |
| Translator | `/admin/translator` | CRUD layanan |
| Halaman CMS | `/admin/pages` | CRUD |
| Users | `/admin/users` | CRUD + assign role |
| Pesan | `/admin/messages` | Tandai dibaca |
