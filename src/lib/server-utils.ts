import path from "node:path";

export function getUploadDir(subfolder: string): string {
  const baseDir = process.env.UPLOAD_DIR_PATH || path.join(process.cwd(), "public", "uploads");
  return path.join(baseDir, subfolder);
}
