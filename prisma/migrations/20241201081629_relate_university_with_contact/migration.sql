/*
  Warnings:

  - A unique constraint covering the columns `[universityId]` on the table `ContactDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `universityId` to the `ContactDetails` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InstituteStatus" AS ENUM ('PROCESSING', 'VERIFIED', 'UNVERIFIED');

-- AlterTable
ALTER TABLE "ContactDetails" ADD COLUMN     "universityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "University" ADD COLUMN     "status" "InstituteStatus" NOT NULL DEFAULT 'UNVERIFIED';

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_universityId_key" ON "ContactDetails"("universityId");

-- AddForeignKey
ALTER TABLE "ContactDetails" ADD CONSTRAINT "ContactDetails_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
