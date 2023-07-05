/*
  Warnings:

  - You are about to drop the column `pp` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "pp",
ADD COLUMN     "profile_picture" TEXT;
