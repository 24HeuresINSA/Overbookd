/*
  Warnings:

  - The values [PC16] on the enum `electricity_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "electricity_type_new" AS ENUM ('PC16_Prise_classique', 'P17_16A_MONO', 'P17_16A_TRI', 'P17_32A_MONO', 'P17_32A_TRI', 'P17_32A_TETRA');
ALTER TABLE "fa_electricity_needs" ALTER COLUMN "electricity_type" TYPE "electricity_type_new" USING ("electricity_type"::text::"electricity_type_new");
ALTER TYPE "electricity_type" RENAME TO "electricity_type_old";
ALTER TYPE "electricity_type_new" RENAME TO "electricity_type";
DROP TYPE "electricity_type_old";
COMMIT;
