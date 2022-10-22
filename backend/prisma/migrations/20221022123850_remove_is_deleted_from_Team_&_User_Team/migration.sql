/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `is_deleted` on the `User_Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "is_deleted";

-- AlterTable
ALTER TABLE "User_Team" DROP COLUMN "is_deleted";
