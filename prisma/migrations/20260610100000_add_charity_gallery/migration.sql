ALTER TABLE "CharityProject"
ADD COLUMN "screenshotUrl" TEXT,
ADD COLUMN "galleryUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
