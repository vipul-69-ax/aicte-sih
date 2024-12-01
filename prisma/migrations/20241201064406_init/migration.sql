-- CreateTable
CREATE TABLE "ContactDetails" (
    "phone" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "town" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "altEmail" TEXT,

    CONSTRAINT "ContactDetails_pkey" PRIMARY KEY ("phone")
);

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "universityName" TEXT NOT NULL,
    "universityType" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "pincode" INTEGER NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContactDetails_email_key" ON "ContactDetails"("email");

-- CreateIndex
CREATE UNIQUE INDEX "University_phone_key" ON "University"("phone");
