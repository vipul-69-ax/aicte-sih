/*
  Warnings:

  - Added the required column `universityId` to the `UniversityApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UniversityApplication" ADD COLUMN     "universityId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UniversityApplication" ADD CONSTRAINT "UniversityApplication_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
