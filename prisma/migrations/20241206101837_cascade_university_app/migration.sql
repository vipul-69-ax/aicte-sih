/*
  Warnings:

  - Changed the type of `doer` on the `Logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `object` on the `Logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Doer" AS ENUM ('EVALUATOR', 'UNIVERSITY');

-- CreateEnum
CREATE TYPE "LogObject" AS ENUM ('APPLICATION', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "UniversityDocuments" DROP CONSTRAINT "UniversityDocuments_uni_application_id_fkey";

-- AlterTable
ALTER TABLE "Logs" ALTER COLUMN "uni_application_id" DROP NOT NULL,
ALTER COLUMN "uni_document_id" DROP NOT NULL,
ALTER COLUMN "evaluator_id" DROP NOT NULL,
DROP COLUMN "doer",
ADD COLUMN     "doer" "Doer" NOT NULL,
DROP COLUMN "object",
ADD COLUMN     "object" "LogObject" NOT NULL;

-- AddForeignKey
ALTER TABLE "UniversityDocuments" ADD CONSTRAINT "UniversityDocuments_uni_application_id_fkey" FOREIGN KEY ("uni_application_id") REFERENCES "UniversityApplication"("uni_application_id") ON DELETE CASCADE ON UPDATE CASCADE;
