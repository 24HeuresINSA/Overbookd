/*
  Warnings:

  - You are about to drop the column `collaboratorId` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the `fa_refuse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_validation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_collaboratorId_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_refuse" DROP CONSTRAINT "fa_refuse_user_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_team_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_validation" DROP CONSTRAINT "fa_validation_user_id_fkey";

-- AlterTable
ALTER TABLE "fa" RENAME COLUMN "collaboratorId" TO "collaborator_id";

-- DropTable
DROP TABLE "fa_refuse";

-- DropTable
DROP TABLE "fa_validation";

-- CreateTable
CREATE TABLE "new_team" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "color" VARCHAR(30) NOT NULL DEFAULT '#000000',
    "icon" VARCHAR(255) NOT NULL DEFAULT 'mdi-circle',

    CONSTRAINT "new_team_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "new_team_code_key" ON "new_team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "new_team_name_key" ON "new_team"("name");

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_collaborator_id_fkey" FOREIGN KEY ("collaborator_id") REFERENCES "collaborator"("id") ON DELETE SET NULL ON UPDATE CASCADE;
