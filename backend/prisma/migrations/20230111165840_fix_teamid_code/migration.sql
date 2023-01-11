/*
  Warnings:

  - You are about to drop the column `team_id` on the `ft_team_request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[time_windows_id,team_code]` on the table `ft_team_request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `team_code` to the `ft_team_request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_team_id_fkey";

-- DropIndex
DROP INDEX "ft_team_request_time_windows_id_team_id_key";

-- AlterTable
ALTER TABLE "ft_team_request" DROP COLUMN "team_id",
ADD COLUMN     "team_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ft_team_request_time_windows_id_team_code_key" ON "ft_team_request"("time_windows_id", "team_code");

-- AddForeignKey
ALTER TABLE "ft_team_request" ADD CONSTRAINT "ft_team_request_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "Team"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
