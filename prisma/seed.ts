import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { createPgPool } from "../src/lib/pg-pool";
import { slugify } from "../src/lib/slug";

const pool = createPgPool();
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
  { slug: "about.manage", name: "Kelola halaman tentang kami" },
  { slug: "setting.manage", name: "Kelola pengaturan situs" },
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
      "about.manage",
      "contact.read",
    ],
  },
  bio_user: {
    name: "Bio User",
    permissions: ["bio_page.access"],
  },
};

async function clearDummyContent() {
  await prisma.translatorRate.deleteMany();
  await prisma.translatorService.deleteMany();
  await prisma.itProject.deleteMany();
  await prisma.charityProject.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.page.deleteMany();
  await prisma.siteSetting.deleteMany({
    where: { key: { in: ["about", "company", "translatorSpeeds"] } },
  });
  await prisma.language.deleteMany();
  await prisma.techStackItem.deleteMany();
  await prisma.itCategory.deleteMany();
}

async function importClients() {
  type RawClient = {
    name: string;
    short: string | null;
    photo: string | null;
    deleted_at: string | null;
  };

  const clientsFile = path.join(process.cwd(), "project_clients.json");
  if (!existsSync(clientsFile)) {
    console.warn("project_clients.json tidak ditemukan — lewati impor klien.");
    return 0;
  }

  const resolveLogo = (photo: string | null): string | null => {
    if (!photo) return null;
    const file = photo.replace(/^.*\//, "");
    if (!file) return null;
    return existsSync(path.join(process.cwd(), "public", "client", file))
      ? `/client/${file}`
      : null;
  };

  const rawClients: RawClient[] = JSON.parse(readFileSync(clientsFile, "utf8"));

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

  if (usedSlugs.size > 0) {
    await prisma.client.deleteMany({
      where: { slug: { notIn: [...usedSlugs] } },
    });
  }

  return usedSlugs.size;
}

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

  await clearDummyContent();
  const clientCount = await importClients();

  console.log("Seed selesai.");
  console.log(`Klien diimpor: ${clientCount}`);
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
