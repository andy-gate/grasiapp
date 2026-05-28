-- CreateTable
CREATE TABLE "_ItProjectToItCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItProjectToItCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- Migrate categoryId to join table
INSERT INTO "_ItProjectToItCategory" ("A", "B")
SELECT p.id, p."categoryId"
FROM "ItProject" p
WHERE p."categoryId" IS NOT NULL
ON CONFLICT DO NOTHING;

-- AlterTable
ALTER TABLE "ItProject" DROP CONSTRAINT "ItProject_categoryId_fkey";

-- AlterTable
ALTER TABLE "ItProject" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "ItProject" RENAME COLUMN "demoUrl" TO "websiteUrl";

-- AlterTable
ALTER TABLE "ItProject" DROP COLUMN "repoUrl";

-- AlterTable
ALTER TABLE "ItProject" ADD COLUMN "appStoreUrl" TEXT,
ADD COLUMN "playStoreUrl" TEXT;

-- CreateIndex
CREATE INDEX "_ItProjectToItCategory_B_index" ON "_ItProjectToItCategory"("B");

-- AddForeignKey
ALTER TABLE "_ItProjectToItCategory" ADD CONSTRAINT "_ItProjectToItCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "ItProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItProjectToItCategory" ADD CONSTRAINT "_ItProjectToItCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ItCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropIndex
DROP INDEX IF EXISTS "ItProject_categoryId_idx";
