/*
  Warnings:

  - You are about to drop the column `typeId` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `TagsOnPages` table. All the data in the column will be lost.
  - You are about to drop the `TagCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TagType` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('WHEREIN', 'WHATSABOUT', 'GOODFOR');

-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('PRIMARY', 'SECONDARY');

-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_typeId_fkey";

-- DropForeignKey
ALTER TABLE "TagsOnPages" DROP CONSTRAINT "TagsOnPages_categoryId_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "typeId",
ADD COLUMN     "type" "TagType";

-- AlterTable
ALTER TABLE "TagsOnPages" DROP COLUMN "categoryId",
ADD COLUMN     "category" "TagCategory";

-- DropTable
DROP TABLE "TagCategory";

-- DropTable
DROP TABLE "TagType";
