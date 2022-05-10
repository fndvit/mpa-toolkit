-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('STAGE', 'TOPIC', 'USER');

-- CreateEnum
CREATE TYPE "TagCategory" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "type" "TagType" NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TagsOnPages" (
    "category" "TagCategory" NOT NULL DEFAULT E'PRIMARY',
    "pageId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "TagsOnPages_pkey" PRIMARY KEY ("tagId","pageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_value_type_key" ON "Tag"("value", "type");

-- AddForeignKey
ALTER TABLE "TagsOnPages" ADD CONSTRAINT "TagsOnPages_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TagsOnPages" ADD CONSTRAINT "TagsOnPages_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
