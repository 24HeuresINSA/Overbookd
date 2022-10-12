-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstname" VARCHAR(30) NOT NULL,
    "lastname" VARCHAR(30) NOT NULL,
    "nickname" VARCHAR(30) NOT NULL,
    "email" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "driverLicenseDate" TIMESTAMP(3) NOT NULL,
    "phone" VARCHAR(30) NOT NULL,
    "hasDriverLicense" BOOLEAN NOT NULL DEFAULT false,
    "department" VARCHAR(3) NOT NULL,
    "year" INTEGER NOT NULL DEFAULT 0,
    "pp" TEXT NOT NULL DEFAULT '',
    "charisma" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "password" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
