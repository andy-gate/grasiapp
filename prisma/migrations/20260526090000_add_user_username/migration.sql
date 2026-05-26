-- AlterTable: add username with backfill for existing users
ALTER TABLE "User" ADD COLUMN "username" TEXT;

UPDATE "User"
SET "username" = LOWER(REGEXP_REPLACE(SPLIT_PART("email", '@', 1), '[^a-zA-Z0-9_]', '_', 'g'))
WHERE "username" IS NULL;

UPDATE "User"
SET "username" = 'user_' || SUBSTRING("id", 1, 8)
WHERE "username" IS NULL OR "username" = '';

-- Resolve potential duplicates by appending id suffix
UPDATE "User" u
SET "username" = u."username" || '_' || SUBSTRING(u."id", 1, 6)
WHERE u."id" IN (
  SELECT "id"
  FROM (
    SELECT "id", ROW_NUMBER() OVER (PARTITION BY "username" ORDER BY "createdAt") AS rn
    FROM "User"
  ) t
  WHERE t.rn > 1
);

ALTER TABLE "User" ALTER COLUMN "username" SET NOT NULL;

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
