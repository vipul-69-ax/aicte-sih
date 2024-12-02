/*
  Warnings:

  - The `messages` column on the `UniversityApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UniversityApplication" ADD COLUMN     "status" "DocumentStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
DROP COLUMN "messages",
ADD COLUMN     "messages" JSONB;

-- AlterTable
ALTER TABLE "UniversityDocuments" ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;
