-- CreateEnum
CREATE TYPE "registration_membership" AS ENUM ('ADHERENT', 'VOLUNTEER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "registration_membership" "registration_membership";
