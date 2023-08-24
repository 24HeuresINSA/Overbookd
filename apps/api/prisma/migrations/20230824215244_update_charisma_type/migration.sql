/*
  Warnings:

  - You are about to alter the column `charisma` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "user" ALTER COLUMN "charisma" SET DEFAULT 0,
ALTER COLUMN "charisma" SET DATA TYPE INTEGER;
