/*
  Warnings:

  - Added the required column `application_desc` to the `UniversityApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `application_name` to the `UniversityApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UniversityApplication" ADD COLUMN     "application_desc" TEXT NOT NULL,
ADD COLUMN     "application_name" TEXT NOT NULL;
