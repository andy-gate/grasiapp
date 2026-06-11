CREATE TABLE "TranslatorRate" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "sourceLang" TEXT NOT NULL,
    "targetLang" TEXT NOT NULL,
    "pricePerPage" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TranslatorRate_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "TranslatorRate_serviceId_sortOrder_idx" ON "TranslatorRate"("serviceId", "sortOrder");

ALTER TABLE "TranslatorRate" ADD CONSTRAINT "TranslatorRate_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "TranslatorService"("id") ON DELETE CASCADE ON UPDATE CASCADE;
