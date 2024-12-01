/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "University_email_key" ON "University"("email");
