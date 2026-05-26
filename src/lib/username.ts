import { prisma } from "@/lib/db";

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string): boolean {
  return /^[a-z0-9_]{3,32}$/.test(normalizeUsername(value));
}

export async function findUserByLoginIdentifier(identifier: string) {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    return prisma.user.findFirst({
      where: { email: { equals: trimmed, mode: "insensitive" } },
    });
  }

  return prisma.user.findUnique({
    where: { username: normalizeUsername(trimmed) },
  });
}
