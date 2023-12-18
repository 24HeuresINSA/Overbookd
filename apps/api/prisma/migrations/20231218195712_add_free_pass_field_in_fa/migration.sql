/*
  Warnings:

  - Added the required column `free_pass` to the `festival_activity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "festival_activity" ADD COLUMN     "free_pass" INTEGER NOT NULL;
