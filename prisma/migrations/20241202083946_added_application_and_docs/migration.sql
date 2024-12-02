-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('NOT_SUBMITTED', 'SUBMITTED', 'PROCESSING', 'VERIFIED', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InstituteStatus" ADD VALUE 'APPROVED';
ALTER TYPE "InstituteStatus" ADD VALUE 'REJECTED';

-- CreateTable
CREATE TABLE "UniversityApplication" (
    "uni_application_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "messages" TEXT NOT NULL,

    CONSTRAINT "UniversityApplication_pkey" PRIMARY KEY ("uni_application_id")
);

-- CreateTable
CREATE TABLE "UniversityDocuments" (
    "uni_doc_id" TEXT NOT NULL,
    "uni_application_id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL,
    "uni_doc_name" TEXT NOT NULL,
    "errors" JSONB,
    "uni_doc_uri" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "messages" JSONB,
    "status" "DocumentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',

    CONSTRAINT "UniversityDocuments_pkey" PRIMARY KEY ("uni_doc_id")
);

-- CreateTable
CREATE TABLE "ApplicationTypes" (
    "application_id" TEXT NOT NULL,
    "application_description" TEXT NOT NULL,

    CONSTRAINT "ApplicationTypes_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "Document" (
    "doc_id" TEXT NOT NULL,
    "doc_name" TEXT NOT NULL,
    "format_uri" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("doc_id")
);

-- CreateTable
CREATE TABLE "ApplicationDocuments" (
    "application_id" TEXT NOT NULL,
    "doc_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationDocuments_application_id_doc_id_key" ON "ApplicationDocuments"("application_id", "doc_id");

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "ApplicationTypes"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_uni_application_id_fkey" FOREIGN KEY ("uni_application_id") REFERENCES "UniversityApplication"("uni_application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Document"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocuments" ADD CONSTRAINT "ApplicationDocuments_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "ApplicationTypes"("application_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocuments" ADD CONSTRAINT "ApplicationDocuments_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "Document"("doc_id") ON DELETE RESTRICT ON UPDATE CASCADE;
