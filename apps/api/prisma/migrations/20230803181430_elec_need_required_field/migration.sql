/*
  Warnings:

  - Made the column `count` on table `fa_electricity_need` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device` on table `fa_electricity_need` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "fa_electricity_need" DROP COLUMN "count";
ALTER TABLE "fa_electricity_need" DROP COLUMN "device";

ALTER TABLE "fa_electricity_need" ADD COLUMN "count" integer NOT NULL;
ALTER TABLE "fa_electricity_need" ADD COLUMN "device" integer NOT NULL;