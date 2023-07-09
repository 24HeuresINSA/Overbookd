/*
  Warnings:

  - You are about to drop the column `fa_validator` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `ft_validator` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "fa_validator",
DROP COLUMN "ft_validator";
