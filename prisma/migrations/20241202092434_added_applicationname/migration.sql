/*
  Warnings:

  - Added the required column `application_name` to the `ApplicationTypes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApplicationTypes" ADD COLUMN     "application_name" TEXT NOT NULL;
