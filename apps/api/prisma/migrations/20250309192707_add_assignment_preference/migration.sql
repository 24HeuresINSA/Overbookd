-- CreateEnum
CREATE TYPE "assignement_preference" AS ENUM ('NO_PREF', 'STACKED', 'FRAGMENTED', 'NO_REST');

-- AlterTable
ALTER TABLE "preference" ADD COLUMN     "assignment" "assignement_preference" NOT NULL DEFAULT 'NO_PREF';
