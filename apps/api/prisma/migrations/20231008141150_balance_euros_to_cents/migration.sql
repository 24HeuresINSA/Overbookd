/*
  Warnings:

  - You are about to alter the column `balance` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/

UPDATE "user" SET "balance" = "balance" * 100;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;
