CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "nameId" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Language_code_key" ON "Language"("code");
CREATE INDEX "Language_isActive_sortOrder_idx" ON "Language"("isActive", "sortOrder");

-- Tarif lama memakai teks bebas; data dummy dihapus lalu diisi ulang lewat seed
DELETE FROM "TranslatorRate";

ALTER TABLE "TranslatorRate"
DROP COLUMN "sourceLang",
DROP COLUMN "targetLang",
ADD COLUMN "sourceLanguageId" TEXT NOT NULL,
ADD COLUMN "targetLanguageId" TEXT NOT NULL;

ALTER TABLE "TranslatorRate" ADD CONSTRAINT "TranslatorRate_sourceLanguageId_fkey" FOREIGN KEY ("sourceLanguageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TranslatorRate" ADD CONSTRAINT "TranslatorRate_targetLanguageId_fkey" FOREIGN KEY ("targetLanguageId") REFERENCES "Language"("id") ON DELETE CASCADE ON UPDATE CASCADE;
