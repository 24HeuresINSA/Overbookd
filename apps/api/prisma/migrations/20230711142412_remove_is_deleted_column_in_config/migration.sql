/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `configuration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "configuration" DROP COLUMN "is_deleted";
