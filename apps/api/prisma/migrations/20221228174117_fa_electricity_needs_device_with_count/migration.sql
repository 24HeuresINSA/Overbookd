-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "electricity_type" ADD VALUE 'P17_16A_TETRA';
ALTER TYPE "electricity_type" ADD VALUE 'P17_63A_MONO';
ALTER TYPE "electricity_type" ADD VALUE 'P17_63A_TRI';
ALTER TYPE "electricity_type" ADD VALUE 'P17_63A_TETRA';
ALTER TYPE "electricity_type" ADD VALUE 'P17_125A_TETRA';

-- AlterTable
ALTER TABLE "fa_electricity_needs" ADD COLUMN     "count" INTEGER,
ADD COLUMN     "device" TEXT;
