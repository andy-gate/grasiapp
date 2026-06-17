import pg from "pg";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "postgres", "host.docker.internal"]);

function isLocalHost(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname.toLowerCase());
}

/** Deteksi apakah koneksi PostgreSQL membutuhkan SSL (mis. DigitalOcean, Neon, RDS). */
export function pgPoolNeedsSsl(connectionString: string): boolean {
  if (process.env.DATABASE_SSL === "true") return true;
  if (process.env.DATABASE_SSL === "false") return false;
  if (process.env.PGSSLMODE === "require") return true;

  try {
    const url = new URL(connectionString);
    const sslmode = url.searchParams.get("sslmode")?.toLowerCase();
    if (sslmode === "disable") return false;
    if (sslmode === "require" || sslmode === "verify-ca" || sslmode === "verify-full") {
      return true;
    }
    if (url.searchParams.get("ssl")?.toLowerCase() === "true") return true;

    // Host remote (managed DB) — Prisma CLI otomatis SSL, driver `pg` perlu eksplisit
    return !isLocalHost(url.hostname);
  } catch {
    return false;
  }
}

export function createPgPool(connectionString = process.env.DATABASE_URL): pg.Pool {
  if (!connectionString) {
    throw new Error("DATABASE_URL belum diset");
  }
  const ssl = pgPoolNeedsSsl(connectionString)
    ? { rejectUnauthorized: false }
    : undefined;
  return new pg.Pool({ connectionString, ssl });
}
