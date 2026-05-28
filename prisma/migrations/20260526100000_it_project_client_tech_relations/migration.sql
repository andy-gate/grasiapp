-- AlterTable
ALTER TABLE "ItProject" ADD COLUMN "clientId" TEXT;

-- CreateTable
CREATE TABLE "_ItProjectToTechStackItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItProjectToTechStackItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- Migrate clientName to clientId
UPDATE "ItProject" p
SET "clientId" = c.id
FROM "Client" c
WHERE p."clientName" IS NOT NULL
  AND (p."clientName" = c."nameId" OR p."clientName" = c."nameEn");

-- Migrate techStack JSON to join table
INSERT INTO "_ItProjectToTechStackItem" ("A", "B")
SELECT DISTINCT p.id, t.id
FROM "ItProject" p
CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(p."techStack", '[]'::jsonb)) AS elem(value)
JOIN "TechStackItem" t ON t."nameId" = elem.value OR t."nameEn" = elem.value
ON CONFLICT DO NOTHING;

-- CreateIndex
CREATE INDEX "_ItProjectToTechStackItem_B_index" ON "_ItProjectToTechStackItem"("B");

-- CreateIndex
CREATE INDEX "ItProject_clientId_idx" ON "ItProject"("clientId");

-- AddForeignKey
ALTER TABLE "ItProject" ADD CONSTRAINT "ItProject_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItProjectToTechStackItem" ADD CONSTRAINT "_ItProjectToTechStackItem_A_fkey" FOREIGN KEY ("A") REFERENCES "ItProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItProjectToTechStackItem" ADD CONSTRAINT "_ItProjectToTechStackItem_B_fkey" FOREIGN KEY ("B") REFERENCES "TechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropColumn
ALTER TABLE "ItProject" DROP COLUMN "clientName",
DROP COLUMN "techStack";
