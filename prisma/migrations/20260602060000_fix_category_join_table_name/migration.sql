-- The previous migration created the ItCategory<->ItProject implicit m2m join
-- table as "_ItProjectToItCategory". Prisma expects the table name ordered
-- alphabetically by model name: "_ItCategoryToItProject" (A=ItCategory, B=ItProject).
-- Recreate it with the correct name and column order, preserving existing links.

CREATE TABLE "_ItCategoryToItProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ItCategoryToItProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- old table: A=ItProject, B=ItCategory  ->  new: A=ItCategory, B=ItProject
INSERT INTO "_ItCategoryToItProject" ("A", "B")
SELECT "B", "A" FROM "_ItProjectToItCategory"
ON CONFLICT DO NOTHING;

DROP TABLE "_ItProjectToItCategory";

-- CreateIndex
CREATE INDEX "_ItCategoryToItProject_B_index" ON "_ItCategoryToItProject"("B");

-- AddForeignKey
ALTER TABLE "_ItCategoryToItProject" ADD CONSTRAINT "_ItCategoryToItProject_A_fkey" FOREIGN KEY ("A") REFERENCES "ItCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItCategoryToItProject" ADD CONSTRAINT "_ItCategoryToItProject_B_fkey" FOREIGN KEY ("B") REFERENCES "ItProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
