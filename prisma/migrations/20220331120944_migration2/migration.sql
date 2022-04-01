-- CreateTable
CREATE TABLE "CaseStudyFields" (
    "name" TEXT NOT NULL,
    "yearEstablished" INTEGER NOT NULL,
    "size" TEXT NOT NULL,
    "governance" TEXT NOT NULL,
    "staff" TEXT NOT NULL,
    "budget" TEXT NOT NULL,
    "budgetLevel" TEXT NOT NULL,
    "coordLatitude" DOUBLE PRECISION NOT NULL,
    "coordAltitude" DOUBLE PRECISION NOT NULL,
    "milestones" JSONB NOT NULL,
    "pageId" INTEGER NOT NULL,

    CONSTRAINT "CaseStudyFields_pkey" PRIMARY KEY ("pageId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudyFields_name_key" ON "CaseStudyFields"("name");

-- AddForeignKey
ALTER TABLE "CaseStudyFields" ADD CONSTRAINT "CaseStudyFields_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
