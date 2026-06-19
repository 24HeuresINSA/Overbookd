/*
  Warnings:

  - You are about to drop the column `portion` on the `shotgun` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shared_meal" ADD COLUMN     "are_multiple_shotguns_allowed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "shotgun" DROP COLUMN "portion",
ADD COLUMN     "portions" INTEGER NOT NULL DEFAULT 1;
