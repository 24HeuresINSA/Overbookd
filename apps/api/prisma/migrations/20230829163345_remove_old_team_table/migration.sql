/*
  Warnings:

  - You are about to drop the column `owner_id` on the `catalog_category` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `fa` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_review` table. All the data in the column will be lost.
  - You are about to drop the column `team_code` on the `ft_team_request` table. All the data in the column will be lost.
  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_code` on the `team_permission` table. All the data in the column will be lost.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `team_id` on the `user_team` table. All the data in the column will be lost.
  - You are about to drop the `team` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ft_id,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "catalog_category" DROP CONSTRAINT "catalog_category_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_team_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_team_code_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_team_code_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_team_id_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_team_code_newTeamCode_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_newTeamCode_key";

-- AlterTable
ALTER TABLE "catalog_category" DROP COLUMN "owner_id";

-- AlterTable
ALTER TABLE "fa" DROP COLUMN "team_id";

-- AlterTable
ALTER TABLE "ft" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "ft_review" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "ft_team_request" DROP COLUMN "team_code";

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey",
DROP COLUMN "team_code",
ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("permission_name", "newTeamCode");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
DROP COLUMN "team_id",
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "newTeamCode");

-- DropTable
DROP TABLE "team";

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_newTeamCode_key" ON "ft_review"("ft_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_newTeamCode_key" ON "ft_team_request"("ft_time_window_id", "newTeamCode");
