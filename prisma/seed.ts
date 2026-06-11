import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient, PublishStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/slug";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PERMISSIONS = [
  { slug: "user.manage", name: "Kelola user & role" },
  { slug: "it_category.manage", name: "Kelola kategori IT" },
  { slug: "tech_stack.manage", name: "Kelola tech stack landing" },
  { slug: "client.manage", name: "Kelola daftar klien" },
  { slug: "it_project.manage", name: "Kelola proyek IT" },
  { slug: "charity.manage", name: "Kelola charity" },
  { slug: "translator.manage", name: "Kelola layanan translator" },
  { slug: "page.manage", name: "Kelola halaman CMS" },
  { slug: "contact.read", name: "Baca pesan kontak" },
  { slug: "bio_page.access", name: "Akses bio page sendiri" },
  { slug: "bio_page.manage", name: "Kelola semua bio page" },
];

const ROLES: Record<
  string,
  { name: string; permissions: string[] }
> = {
  super_admin: {
    name: "Super Admin",
    permissions: PERMISSIONS.map((p) => p.slug),
  },
  admin: {
    name: "Admin",
    permissions: PERMISSIONS.filter((p) => p.slug !== "user.manage").map(
      (p) => p.slug,
    ),
  },
  editor: {
    name: "Editor",
    permissions: [
      "it_category.manage",
      "tech_stack.manage",
      "client.manage",
      "it_project.manage",
      "charity.manage",
      "translator.manage",
      "page.manage",
      "contact.read",
    ],
  },
  bio_user: {
    name: "Bio User",
    permissions: ["bio_page.access"],
  },
};

async function main() {
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { slug: p.slug },
      update: { name: p.name },
      create: p,
    });
  }

  for (const [slug, config] of Object.entries(ROLES)) {
    const role = await prisma.role.upsert({
      where: { slug },
      update: { name: config.name },
      create: { slug, name: config.name },
    });

    for (const permSlug of config.permissions) {
      const perm = await prisma.permission.findUniqueOrThrow({
        where: { slug: permSlug },
      });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  const superRole = await prisma.role.findUniqueOrThrow({
    where: { slug: "super_admin" },
  });

  const passwordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@grasiapp.local" },
    update: { passwordHash, name: "Super Admin", username: "admin", isActive: true },
    create: {
      email: "admin@grasiapp.local",
      username: "admin",
      name: "Super Admin",
      passwordHash,
      isActive: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: superRole.id } },
    update: {},
    create: { userId: admin.id, roleId: superRole.id },
  });

  const categories = [
    {
      slug: "web",
      nameId: "Web",
      nameEn: "Web",
      descriptionId: "Website dan aplikasi web",
      descriptionEn: "Websites and web applications",
    },
    {
      slug: "mobile",
      nameId: "Mobile",
      nameEn: "Mobile",
      descriptionId: "Aplikasi iOS dan Android",
      descriptionEn: "iOS and Android applications",
    },
    {
      slug: "ai",
      nameId: "AI / Data",
      nameEn: "AI / Data",
      descriptionId: "Kecerdasan buatan dan analitik data",
      descriptionEn: "Artificial intelligence and data analytics",
    },
    {
      slug: "infrastructure",
      nameId: "Infrastruktur",
      nameEn: "Infrastructure",
      descriptionId: "DevOps, cloud, dan infrastruktur",
      descriptionEn: "DevOps, cloud, and infrastructure",
    },
  ];

  const catRecords = [];
  for (let i = 0; i < categories.length; i++) {
    const c = categories[i];
    const record = await prisma.itCategory.upsert({
      where: { slug: c.slug },
      update: { ...c, sortOrder: i },
      create: { ...c, sortOrder: i },
    });
    catRecords.push(record);
  }

  const techStackItems = [
    { slug: "nextjs", nameId: "Next.js", nameEn: "Next.js" },
    { slug: "react", nameId: "React", nameEn: "React" },
    { slug: "typescript", nameId: "TypeScript", nameEn: "TypeScript" },
    { slug: "postgresql", nameId: "PostgreSQL", nameEn: "PostgreSQL" },
    { slug: "nodejs", nameId: "Node.js", nameEn: "Node.js" },
    { slug: "cloud", nameId: "Cloud", nameEn: "Cloud" },
    { slug: "docker", nameId: "Docker", nameEn: "Docker" },
    { slug: "api-rest", nameId: "API / REST", nameEn: "API / REST" },
  ];

  for (let i = 0; i < techStackItems.length; i++) {
    const item = techStackItems[i];
    await prisma.techStackItem.upsert({
      where: { slug: item.slug },
      update: { ...item, sortOrder: i, isActive: true },
      create: { ...item, sortOrder: i, isActive: true },
    });
  }

  // Impor klien dari project_clients.json (logo dipetakan ke public/client per nama file)
  type RawClient = {
    name: string;
    short: string | null;
    photo: string | null;
    deleted_at: string | null;
  };

  const resolveLogo = (photo: string | null): string | null => {
    if (!photo) return null;
    const file = photo.replace(/^.*\//, "");
    if (!file) return null;
    return existsSync(path.join(process.cwd(), "public", "client", file))
      ? `/client/${file}`
      : null;
  };

  const rawClients: RawClient[] = JSON.parse(
    readFileSync(path.join(process.cwd(), "project_clients.json"), "utf8"),
  );

  const usedSlugs = new Set<string>();
  let order = 0;
  for (const rc of rawClients) {
    if (rc.deleted_at) continue;
    const baseSlug = slugify(rc.short || rc.name) || slugify(rc.name);
    if (!baseSlug) continue;
    let slug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(slug)) slug = `${baseSlug}-${suffix++}`;
    usedSlugs.add(slug);

    const data = {
      nameId: rc.name,
      nameEn: rc.name,
      logoUrl: resolveLogo(rc.photo),
      sortOrder: order,
      isActive: true,
    };
    await prisma.client.upsert({
      where: { slug },
      update: data,
      create: { slug, ...data },
    });
    order++;
  }

  // Hapus klien yang tidak lagi ada di daftar (termasuk grasiapp & placeholder lama)
  await prisma.client.deleteMany({
    where: { slug: { notIn: [...usedSlugs] } },
  });

  const categoryMap = new Map(catRecords.map((c) => [c.slug, c.id]));
  const stackRecords = await prisma.techStackItem.findMany({
    where: {
      slug: {
        in: [
          "nextjs",
          "postgresql",
          "react",
          "typescript",
          "nodejs",
          "cloud",
          "docker",
          "api-rest",
        ],
      },
    },
  });
  const stackMap = new Map(stackRecords.map((s) => [s.slug, s.id]));
  const clientRecords = await prisma.client.findMany({
    where: {
      slug: { in: ["telkom", "kemenkeu-ri", "msn", "bbkfp"] },
    },
  });
  const clientMap = new Map(clientRecords.map((c) => [c.slug, c.id]));

  const itProjects = [
    {
      slug: "company-profile-platform",
      titleId: "Platform Company Profile",
      titleEn: "Company Profile Platform",
      summaryId: "Website company profile dengan CMS dan admin panel.",
      summaryEn: "Company profile website with CMS and admin panel.",
      bodyId:
        "<p>Dummy project untuk menampilkan format detail proyek website corporate lengkap dengan CMS, manajemen konten, dan integrasi contact form.</p>",
      bodyEn:
        "<p>Dummy project to preview website project detail layout with CMS, content management, and contact form integration.</p>",
      year: 2026,
      categorySlugs: ["web"],
      techStackSlugs: ["nextjs", "typescript", "postgresql"],
      clientSlug: "bbkfp",
      featured: true,
      sortOrder: 0,
      websiteUrl: "https://example.com/company-profile",
      screenshotUrl: "/client/bbkfp.png",
      galleryUrls: ["/client/bbkfp.png", "/client/id_central.png", "/client/unair.png"],
    },
    {
      slug: "mobile-loyalty-app",
      titleId: "Aplikasi Loyalty Pelanggan",
      titleEn: "Customer Loyalty Mobile App",
      summaryId: "Aplikasi mobile untuk point reward, voucher, dan notifikasi promo.",
      summaryEn:
        "Mobile app for reward points, vouchers, and promotional notifications.",
      bodyId:
        "<p>Dummy project mobile untuk simulasi tampilan kartu proyek dengan link Website, App Store, dan Play Store.</p>",
      bodyEn:
        "<p>Dummy mobile project to preview project cards with Website, App Store, and Play Store links.</p>",
      year: 2025,
      categorySlugs: ["mobile"],
      techStackSlugs: ["react", "nodejs", "api-rest", "cloud"],
      clientSlug: "telkom",
      featured: true,
      sortOrder: 1,
      websiteUrl: "https://example.com/loyalty",
      appStoreUrl: "https://apps.apple.com/",
      playStoreUrl: "https://play.google.com/store",
      screenshotUrl: "/client/telkom.png",
      galleryUrls: ["/client/telkom.png", "/client/msn.png", "/client/pmk_its.png"],
    },
    {
      slug: "smart-analytics-dashboard",
      titleId: "Dashboard Analitik Cerdas",
      titleEn: "Smart Analytics Dashboard",
      summaryId: "Dashboard KPI real-time dengan laporan otomatis dan insight berbasis data.",
      summaryEn:
        "Real-time KPI dashboard with automated reporting and data-driven insights.",
      bodyId:
        "<p>Dummy project dashboard data untuk uji tampilan kategori multiple, tech stack badges, dan konten detail yang lebih panjang.</p>",
      bodyEn:
        "<p>Dummy analytics dashboard project to test multiple categories, tech stack badges, and longer detail content.</p>",
      year: 2024,
      categorySlugs: ["web", "ai"],
      techStackSlugs: ["nextjs", "postgresql", "docker", "cloud"],
      clientSlug: "kemenkeu-ri",
      featured: false,
      sortOrder: 2,
      websiteUrl: "https://example.com/analytics",
      screenshotUrl: "/client/kemenkeu.png",
      galleryUrls: ["/client/kemenkeu.png", "/client/kominfo.png", "/client/its.png"],
    },
    {
      slug: "translation-workflow-portal",
      titleId: "Portal Workflow Penerjemahan",
      titleEn: "Translation Workflow Portal",
      summaryId:
        "Portal internal untuk assignment penerjemah, review kualitas, dan tracking deadline.",
      summaryEn:
        "Internal portal for translator assignments, quality review, and deadline tracking.",
      bodyId:
        "<p>Dummy project portal operasional untuk melihat variasi tampilan list ketika jumlah project lebih banyak.</p>",
      bodyEn:
        "<p>Dummy operations portal project to preview list layout with more project entries.</p>",
      year: 2026,
      categorySlugs: ["web", "infrastructure"],
      techStackSlugs: ["react", "typescript", "nodejs", "postgresql"],
      clientSlug: "msn",
      featured: false,
      sortOrder: 3,
      websiteUrl: "https://example.com/translation-portal",
      screenshotUrl: "/client/msn.png",
      galleryUrls: ["/client/msn.png", "/client/gki_damai.png", "/client/pemkot_ambon.png"],
    },
  ];

  for (const project of itProjects) {
    const categoryConnect = project.categorySlugs
      .map((slug) => categoryMap.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ id }));
    const techStackConnect = project.techStackSlugs
      .map((slug) => stackMap.get(slug))
      .filter((id): id is string => Boolean(id))
      .map((id) => ({ id }));
    const clientId = project.clientSlug ? clientMap.get(project.clientSlug) : null;

    await prisma.itProject.upsert({
      where: { slug: project.slug },
      update: {
        titleId: project.titleId,
        titleEn: project.titleEn,
        summaryId: project.summaryId,
        summaryEn: project.summaryEn,
        bodyId: project.bodyId,
        bodyEn: project.bodyEn,
        year: project.year,
        websiteUrl: project.websiteUrl,
        appStoreUrl: project.appStoreUrl,
        playStoreUrl: project.playStoreUrl,
        screenshotUrl: project.screenshotUrl,
        galleryUrls: project.galleryUrls ?? [],
        clientId: clientId ?? null,
        categories: { set: categoryConnect },
        techStackItems: { set: techStackConnect },
        status: PublishStatus.PUBLISHED,
        featured: project.featured,
        sortOrder: project.sortOrder,
      },
      create: {
        slug: project.slug,
        titleId: project.titleId,
        titleEn: project.titleEn,
        summaryId: project.summaryId,
        summaryEn: project.summaryEn,
        bodyId: project.bodyId,
        bodyEn: project.bodyEn,
        year: project.year,
        websiteUrl: project.websiteUrl,
        appStoreUrl: project.appStoreUrl,
        playStoreUrl: project.playStoreUrl,
        screenshotUrl: project.screenshotUrl,
        galleryUrls: project.galleryUrls ?? [],
        clientId: clientId ?? null,
        categories: { connect: categoryConnect },
        techStackItems: { connect: techStackConnect },
        status: PublishStatus.PUBLISHED,
        featured: project.featured,
        sortOrder: project.sortOrder,
        publishedAt: new Date(),
        createdById: admin.id,
      },
    });
  }

  const charityProjects = [
    {
      slug: "community-support-2026",
      titleId: "Dukungan Komunitas 2026",
      titleEn: "Community Support 2026",
      summaryId:
        "Program bantuan untuk komunitas lokal berupa sembako, pendidikan, dan kesehatan dasar.",
      summaryEn:
        "Support program for local communities covering food aid, education, and basic health.",
      bodyId:
        "<p>Dummy program charity untuk preview layout detail: gallery mosaic, info penerima manfaat, dan tombol donasi.</p>",
      bodyEn:
        "<p>Dummy charity program to preview the detail layout: mosaic gallery, beneficiary info, and donate button.</p>",
      beneficiary: "Komunitas lokal",
      location: "Surabaya, Indonesia",
      donationUrl: "https://example.com/donate/community-support",
      goalAmount: 50000000,
      raisedAmount: 32500000,
      featured: true,
      sortOrder: 0,
      screenshotUrl: "/client/gki_damai.png",
      galleryUrls: [
        "/client/gki_damai.png",
        "/client/pmk_its.png",
        "/client/msn.png",
        "/client/pemkot_ambon.png",
        "/client/its.png",
        "/client/unair.png",
      ],
    },
    {
      slug: "scholarship-fund",
      titleId: "Beasiswa Anak Bangsa",
      titleEn: "Scholarship Fund",
      summaryId:
        "Bantuan biaya pendidikan untuk pelajar berprestasi dari keluarga prasejahtera.",
      summaryEn:
        "Tuition support for high-achieving students from underprivileged families.",
      bodyId:
        "<p>Dummy program beasiswa untuk melihat variasi kartu list charity dengan progress donasi.</p>",
      bodyEn:
        "<p>Dummy scholarship program to preview charity list cards with donation progress.</p>",
      beneficiary: "Pelajar prasejahtera",
      location: "Jawa Timur, Indonesia",
      donationUrl: "https://example.com/donate/scholarship",
      goalAmount: 100000000,
      raisedAmount: 45000000,
      featured: false,
      sortOrder: 1,
      screenshotUrl: "/client/its.png",
      galleryUrls: ["/client/its.png", "/client/unair.png", "/client/pmk_its.png"],
    },
    {
      slug: "disaster-relief",
      titleId: "Tanggap Bencana",
      titleEn: "Disaster Relief",
      summaryId:
        "Penyaluran bantuan darurat untuk korban bencana alam di wilayah terdampak.",
      summaryEn:
        "Emergency aid distribution for natural disaster victims in affected areas.",
      bodyId:
        "<p>Dummy program tanggap bencana tanpa target donasi untuk menguji layout tanpa progress bar.</p>",
      bodyEn:
        "<p>Dummy disaster relief program without a donation goal to test the layout without a progress bar.</p>",
      beneficiary: "Korban bencana",
      location: "Indonesia",
      featured: false,
      sortOrder: 2,
      screenshotUrl: "/client/pemkot_ambon.png",
      galleryUrls: ["/client/pemkot_ambon.png", "/client/kemendesa.png"],
    },
  ];

  for (const program of charityProjects) {
    const { slug, ...data } = program;
    await prisma.charityProject.upsert({
      where: { slug },
      update: { ...data, status: PublishStatus.PUBLISHED },
      create: {
        slug,
        ...data,
        status: PublishStatus.PUBLISHED,
        publishedAt: new Date(),
        createdById: admin.id,
      },
    });
  }

  await prisma.translatorService.upsert({
    where: { slug: "document-translation" },
    update: {},
    create: {
      slug: "document-translation",
      nameId: "Terjemahan Dokumen",
      nameEn: "Document Translation",
      descriptionId: "Terjemahan dokumen resmi dan bisnis.",
      descriptionEn: "Official and business document translation.",
      sourceLanguages: ["id", "en"],
      targetLanguages: ["id", "en"],
      serviceType: "document",
      pricingNoteId: "Hubungi kami untuk penawaran harga.",
      pricingNoteEn: "Contact us for a quote.",
      status: PublishStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      createdById: admin.id,
    },
  });

  for (const page of [
    {
      slug: "about",
      titleId: "Tentang Kami",
      titleEn: "About Us",
      bodyId: "<p>Kami adalah perusahaan yang berfokus pada IT, charity, dan layanan penerjemahan.</p>",
      bodyEn: "<p>We are a company focused on IT, charity, and translation services.</p>",
    },
    {
      slug: "translator-overview",
      titleId: "Layanan Penerjemahan",
      titleEn: "Translation Services",
      bodyId: "<p>Layanan penerjemahan profesional untuk dokumen dan bisnis.</p>",
      bodyEn: "<p>Professional translation services for documents and business.</p>",
    },
  ]) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { ...page, status: PublishStatus.PUBLISHED, updatedById: admin.id },
      create: {
        ...page,
        status: PublishStatus.PUBLISHED,
        updatedById: admin.id,
      },
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "company" },
    update: {
      value: {
        nameId: "Grasia Prima Perfekta",
        nameEn: "Grasia Prima Perfekta",
        email: "grasiaprimaperfekta@gmail.com",
        phone: "081221120660",
        waNumber: "6281221120660",
        addressId: "Jakarta, Indonesia",
        addressEn: "Jakarta, Indonesia",
      },
    },
    create: {
      key: "company",
      value: {
        nameId: "Grasia Prima Perfekta",
        nameEn: "Grasia Prima Perfekta",
        email: "grasiaprimaperfekta@gmail.com",
        phone: "081221120660",
        waNumber: "6281221120660",
        addressId: "Jakarta, Indonesia",
        addressEn: "Jakarta, Indonesia",
      },
    },
  });

  console.log("Seed selesai.");
  console.log("Login admin: admin / admin@grasiapp.local — password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
