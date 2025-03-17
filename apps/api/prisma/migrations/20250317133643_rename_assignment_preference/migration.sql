/*
  Warnings:

  - The `assignment` column on the `preference` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "assignment_preference" AS ENUM ('NO_PREF', 'STACKED', 'FRAGMENTED', 'NO_REST');

-- AlterTable
ALTER TABLE "preference" DROP COLUMN "assignment",
ADD COLUMN     "assignment" "assignment_preference" NOT NULL DEFAULT 'NO_PREF';

-- DropEnum
DROP TYPE "assignement_preference";
