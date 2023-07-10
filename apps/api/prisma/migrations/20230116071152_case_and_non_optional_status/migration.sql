/*
  Warnings:

  - Made the column `status` on table `ft` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ft" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'DRAFT';
