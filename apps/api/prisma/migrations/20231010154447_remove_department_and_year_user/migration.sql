/*
  Warnings:

  - You are about to drop the column `department` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "department",
DROP COLUMN "year";

-- DropEnum
DROP TYPE "department";

-- DropEnum
DROP TYPE "year";
