/*
  Warnings:

  - The primary key for the `ContactDetails` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ContactDetails" DROP CONSTRAINT "ContactDetails_pkey",
ALTER COLUMN "phone" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("phone");
