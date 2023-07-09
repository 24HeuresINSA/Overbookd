/*
  Warnings:

  - You are about to drop the column `number` on the `ft_team_request` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `ft_team_request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ft_team_request" DROP COLUMN "number",
ADD COLUMN     "quantity" INTEGER NOT NULL;
