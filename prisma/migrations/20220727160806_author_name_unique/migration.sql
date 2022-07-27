/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Author` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Author` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");
