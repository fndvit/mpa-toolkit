/*
  Warnings:

  - You are about to drop the column `summary` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the `_PageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PageToUser" DROP CONSTRAINT "_PageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PageToUser" DROP CONSTRAINT "_PageToUser_B_fkey";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "summary";

-- DropTable
DROP TABLE "_PageToUser";

-- CreateTable
CREATE TABLE "CaseStudy" (
    "name" TEXT NOT NULL,
    "established" INTEGER NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "governance" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "budgetLevel" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "long" DOUBLE PRECISION NOT NULL,
    "milestones" JSONB NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("pageId")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "summary" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("pageId")
);

-- CreateTable
CREATE TABLE "_ChapterToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_name_key" ON "CaseStudy"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_ChapterToUser_AB_unique" ON "_ChapterToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChapterToUser_B_index" ON "_ChapterToUser"("B");

-- AddForeignKey
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChapterToUser" ADD FOREIGN KEY ("A") REFERENCES "Chapter"("pageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChapterToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
