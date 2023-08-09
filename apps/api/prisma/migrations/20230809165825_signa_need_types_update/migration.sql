-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "signa_type" ADD VALUE 'BACHE';
ALTER TYPE "signa_type" ADD VALUE 'AFFICHE';

-- AlterTable
ALTER TABLE "fa_signa_need" ADD COLUMN "size" VARCHAR(50);
