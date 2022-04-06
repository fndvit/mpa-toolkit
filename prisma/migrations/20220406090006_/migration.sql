/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `alt` on the `TagCategory` table. All the data in the column will be lost.
  - You are about to drop the `_PageToTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_PageToTag" DROP CONSTRAINT "_PageToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_PageToTag" DROP CONSTRAINT "_PageToTag_B_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "TagCategory" DROP COLUMN "alt";

-- DropTable
DROP TABLE "_PageToTag";

-- CreateTable
CREATE TABLE "TagsOnPages" (
    "pageId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,
    "categoryId" INTEGER,

    CONSTRAINT "TagsOnPages_pkey" PRIMARY KEY ("tagId","pageId")
);

-- AddForeignKey
ALTER TABLE "TagsOnPages" ADD CONSTRAINT "TagsOnPages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPages" ADD CONSTRAINT "TagsOnPages_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPages" ADD CONSTRAINT "TagsOnPages_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TagCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
