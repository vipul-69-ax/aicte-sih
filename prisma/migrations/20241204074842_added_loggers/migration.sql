-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'P5');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('APP_CREATED', 'DOC_SUBMITTED', 'DOC_RESUBMITTED', 'PRIORITY_CHANGED', 'DOC_VIEWED', 'APPROVED', 'REJECTED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentStatus" ADD VALUE 'ASSIGNED';
ALTER TYPE "DocumentStatus" ADD VALUE 'IN_REVIEW';

-- AlterTable
ALTER TABLE "ApplicationTypes" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "deadline" TIMESTAMP(3),
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "UniversityApplication" ADD COLUMN     "evaluator_id" TEXT;

-- AlterTable
ALTER TABLE "UniversityDocuments" ADD COLUMN     "evaluator_id" TEXT,
ADD COLUMN     "extractedTexts" TEXT;

-- CreateTable
CREATE TABLE "Evaluator" (
    "evaluator_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "specialization" TEXT[],

    CONSTRAINT "Evaluator_pkey" PRIMARY KEY ("evaluator_id")
);

-- CreateTable
CREATE TABLE "Logs" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uni_application_id" TEXT NOT NULL,
    "uni_document_id" TEXT NOT NULL,
    "evaluator_id" TEXT NOT NULL,
    "actionPerformed" TEXT NOT NULL,
    "doer" TEXT NOT NULL,
    "object" TEXT NOT NULL,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Evaluator"("evaluator_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "Evaluator"("evaluator_id") ON DELETE SET NULL ON UPDATE CASCADE;
