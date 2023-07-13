/*
  Warnings:

  - You are about to drop the `fa_collaborator` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fa_collaborator" DROP CONSTRAINT "fa_collaborator_collaborator_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_collaborator" DROP CONSTRAINT "fa_collaborator_fa_id_fkey";

-- AlterTable
ALTER TABLE "fa" ADD COLUMN "collaboratorId" INTEGER;

-- DropTable
DROP TABLE "fa_collaborator";

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_collaboratorId_fkey" FOREIGN KEY ("collaboratorId") REFERENCES "collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
