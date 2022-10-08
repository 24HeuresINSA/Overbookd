/*
  Warnings:

  - Changed the type of `department` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `year` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Year" AS ENUM ('A1', 'A2', 'A3', 'A4', 'A5', 'VIEUX', 'AUTRE');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('TC', 'IF', 'GE', 'GM', 'GI', 'GCU', 'GEN', 'SGM', 'BS', 'FIMI', 'AUTRE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "has_payed_contributions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reset_password_expires" TIMESTAMP(3),
ADD COLUMN     "reset_password_token" TEXT,
DROP COLUMN "department",
ADD COLUMN     "department" "Department" NOT NULL,
DROP COLUMN "year",
ADD COLUMN     "year" "Year" NOT NULL,
ALTER COLUMN "pp" DROP NOT NULL,
ALTER COLUMN "pp" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Team" (
    "name" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "User_Team" (
    "user_id" INTEGER NOT NULL,
    "team_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Team_pkey" PRIMARY KEY ("user_id","team_id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" SERIAL NOT NULL,
    "group_name" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "charisma" INTEGER NOT NULL,
    "is_hard_only" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availabilities" (
    "user_id" INTEGER NOT NULL,
    "timeslot_id" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Availabilities_pkey" PRIMARY KEY ("user_id","timeslot_id")
);

-- AddForeignKey
ALTER TABLE "User_Team" ADD CONSTRAINT "User_Team_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Team" ADD CONSTRAINT "User_Team_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availabilities" ADD CONSTRAINT "Availabilities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availabilities" ADD CONSTRAINT "Availabilities_timeslot_id_fkey" FOREIGN KEY ("timeslot_id") REFERENCES "TimeSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_fkey" FOREIGN KEY ("from") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_fkey" FOREIGN KEY ("to") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
