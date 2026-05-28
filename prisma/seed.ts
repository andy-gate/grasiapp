import "dotenv/config";
import { PrismaClient, PublishStatus } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

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

  const clients = [
    { slug: "grasiapp", nameId: "GrasiApp", nameEn: "GrasiApp" },
    { slug: "klien-a", nameId: "Klien A", nameEn: "Client A" },
    { slug: "klien-b", nameId: "Klien B", nameEn: "Client B" },
    { slug: "klien-c", nameId: "Klien C", nameEn: "Client C" },
    { slug: "klien-d", nameId: "Klien D", nameEn: "Client D" },
    { slug: "klien-e", nameId: "Klien E", nameEn: "Client E" },
    { slug: "klien-f", nameId: "Klien F", nameEn: "Client F" },
  ];

  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    await prisma.client.upsert({
      where: { slug: client.slug },
      update: { ...client, sortOrder: i, isActive: true },
      create: { ...client, sortOrder: i, isActive: true },
    });
  }

  const grasiappClient = await prisma.client.findUnique({
    where: { slug: "grasiapp" },
  });
  const stackRecords = await prisma.techStackItem.findMany({
    where: { slug: { in: ["nextjs", "postgresql"] } },
  });

  await prisma.itProject.upsert({
    where: { slug: "company-profile-platform" },
    update: {
      clientId: grasiappClient?.id ?? null,
      categories: { set: [{ id: catRecords[0].id }] },
      techStackItems: {
        set: stackRecords.map((item) => ({ id: item.id })),
      },
    },
    create: {
      slug: "company-profile-platform",
      titleId: "Platform Company Profile",
      titleEn: "Company Profile Platform",
      summaryId: "Website company profile dengan CMS dan admin panel.",
      summaryEn: "Company profile website with CMS and admin panel.",
      bodyId: "<p>Proyek internal GrasiApp.</p>",
      bodyEn: "<p>Internal GrasiApp project.</p>",
      clientId: grasiappClient?.id,
      techStackItems: {
        connect: stackRecords.map((item) => ({ id: item.id })),
      },
      year: 2026,
      categories: { connect: [{ id: catRecords[0].id }] },
      status: PublishStatus.PUBLISHED,
      featured: true,
      sortOrder: 0,
      publishedAt: new Date(),
      createdById: admin.id,
    },
  });

  await prisma.charityProject.upsert({
    where: { slug: "community-support-2026" },
    update: {},
    create: {
      slug: "community-support-2026",
      titleId: "Dukungan Komunitas 2026",
      titleEn: "Community Support 2026",
      summaryId: "Program bantuan untuk komunitas lokal.",
      summaryEn: "Support program for local communities.",
      beneficiary: "Komunitas lokal",
      location: "Indonesia",
      status: PublishStatus.PUBLISHED,
      featured: true,
      publishedAt: new Date(),
      createdById: admin.id,
    },
  });

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
