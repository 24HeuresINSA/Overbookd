/*
  Warnings:

  - You are about to drop the column `isValide` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "isValide",
ADD COLUMN     "isValid" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "to" SET DEFAULT -1;
