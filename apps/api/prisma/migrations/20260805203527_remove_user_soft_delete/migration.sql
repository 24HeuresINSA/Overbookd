/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "user_is_deleted_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_deleted";
