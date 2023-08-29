/*
  Warnings:

  - You are about to drop the column `newOwnerCode` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft_review` table. All the data in the column will be lost.
  - You are about to drop the column `newTeamCode` on the `ft_team_request` table. All the data in the column will be lost.
  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newTeamCode` on the `team_permission` table. All the data in the column will be lost.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `newTeamCode` on the `user_team` table. All the data in the column will be lost.
  - You are about to drop the `new_team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ft_id,team_code]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,team_code]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_code` to the `ft_review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `ft_team_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `team_permission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_code` to the `user_team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_newOwnerCode_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_newTeamCode_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_newTeamCode_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_newTeamCode_key";

-- AlterTable
ALTER TABLE "catalog_category" RENAME COLUMN "newOwnerCode" TO "owner_code";

-- AlterTable
ALTER TABLE "fa" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft_review" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "ft_team_request" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey";

-- AlterTable
ALTER TABLE "team_permission" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("permission_name", "team_code");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey";

-- AlterTable
ALTER TABLE "user_team" RENAME COLUMN "newTeamCode" TO "team_code";

-- AlterTable
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "team_code");

-- AlterTable
ALTER TABLE "new_team" RENAME TO "team";

-- CreateIndex
CREATE UNIQUE INDEX "team_code_key" ON "team"("code");

-- CreateIndex
CREATE UNIQUE INDEX "team_name_key" ON "team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_team_code_key" ON "ft_review"("ft_id", "team_code");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_team_code_key" ON "ft_team_request"("ft_time_window_id", "team_code");

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fa" ADD CONSTRAINT "fa_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catalog_category" ADD CONSTRAINT "catalog_category_owner_code_fkey" FOREIGN KEY ("owner_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "team" RENAME CONSTRAINT "new_team_pkey" TO "team_pkey";
