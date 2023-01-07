/*
  Warnings:

  - The primary key for the `fa_refuse` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `fa_validation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_pkey",
ADD CONSTRAINT "fa_refuse_pkey" PRIMARY KEY ("fa_id", "team_id");

-- AlterTable
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_pkey",
ADD CONSTRAINT "fa_validation_pkey" PRIMARY KEY ("fa_id", "team_id");
