/*
  Warnings:

  - You are about to drop the column `primary` on the `TagType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "primary" BOOLEAN;

-- AlterTable
ALTER TABLE "TagType" DROP COLUMN "primary";
