/*
  Warnings:

  - The primary key for the `team_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user_team` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[ft_id,team_code,newTeamCode]` on the table `ft_review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ft_time_window_id,team_code,newTeamCode]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Made the column `newTeamCode` on table `ft_review` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `ft_team_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `team_permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `newTeamCode` on table `user_team` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_newTeamCode_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_newTeamCode_fkey";

-- DropIndex
DROP INDEX "ft_review_ft_id_team_code_key";

-- DropIndex
DROP INDEX "ft_team_request_ft_time_window_id_team_code_key";

-- AlterTable
ALTER TABLE "ft_review" ALTER COLUMN "newTeamCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "ft_team_request" ALTER COLUMN "newTeamCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "team_permission" DROP CONSTRAINT "team_permission_pkey",
ALTER COLUMN "newTeamCode" SET NOT NULL,
ADD CONSTRAINT "team_permission_pkey" PRIMARY KEY ("team_code", "permission_name", "newTeamCode");

-- AlterTable
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_pkey",
ALTER COLUMN "newTeamCode" SET NOT NULL,
ADD CONSTRAINT "user_team_pkey" PRIMARY KEY ("user_id", "team_id", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_review_ft_id_team_code_newTeamCode_key" ON "ft_review"("ft_id", "team_code", "newTeamCode");

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_ft_time_window_id_team_code_newTeamCode_key" ON "ft_team_request"("ft_time_window_id", "team_code", "newTeamCode");

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_permission" ADD CONSTRAINT "team_permission_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_review" ADD CONSTRAINT "ft_review_newTeamCode_fkey" FOREIGN KEY ("newTeamCode") REFERENCES "new_team"("code") ON DELETE CASCADE ON UPDATE CASCADE;
