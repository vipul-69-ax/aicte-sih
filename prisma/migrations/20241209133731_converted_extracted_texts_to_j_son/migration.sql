/*
  Warnings:

  - The `extractedTexts` column on the `UniversityDocuments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UniversityDocuments" DROP COLUMN "extractedTexts",
ADD COLUMN     "extractedTexts" JSONB;
