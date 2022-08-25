-- CreateTable
CREATE TABLE "Search" (
    "pageId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "vector" tsvector NOT NULL,

    CONSTRAINT "Search_pkey" PRIMARY KEY ("pageId")
);

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
