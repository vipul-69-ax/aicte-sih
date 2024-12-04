/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Evaluator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Evaluator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Evaluator_email_key" ON "Evaluator"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Evaluator_phone_key" ON "Evaluator"("phone");
