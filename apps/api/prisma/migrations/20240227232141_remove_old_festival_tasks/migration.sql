/*
  Warnings:

  - You are about to drop the column `time_span_id` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the `ft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_team_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_time_span` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_time_window` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_user_request` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[period_id,assignee_id]` on the table `assignment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ft_id` to the `assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mobilization_id` to the `assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period_id` to the `assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `festival_task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_team_request_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_time_span_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_user_request_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_location_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_parent_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_user_in_charge_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_feedback" DROP CONSTRAINT "ft_feedback_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_feedback" DROP CONSTRAINT "ft_feedback_ft_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_ft_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_review" DROP CONSTRAINT "ft_review_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_ft_time_window_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_team_request" DROP CONSTRAINT "ft_team_request_team_code_fkey";

-- DropForeignKey
ALTER TABLE "ft_time_span" DROP CONSTRAINT "ft_time_span_ft_time_window_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_time_window" DROP CONSTRAINT "ft_time_window_ft_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_user_request" DROP CONSTRAINT "ft_user_request_ft_time_window_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_user_request" DROP CONSTRAINT "ft_user_request_user_id_fkey";

-- DropIndex
DROP INDEX "assignment_time_span_id_assignee_id_key";

-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "time_span_id",
ADD COLUMN     "ft_id" INTEGER NOT NULL,
ADD COLUMN     "mobilization_id" TEXT NOT NULL,
ADD COLUMN     "period_id" INTEGER NOT NULL,
ALTER COLUMN "team_request_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "festival_task" ADD COLUMN     "category" "task_category" NOT NULL;

-- DropTable
DROP TABLE "ft";

-- DropTable
DROP TABLE "ft_feedback";

-- DropTable
DROP TABLE "ft_review";

-- DropTable
DROP TABLE "ft_team_request";

-- DropTable
DROP TABLE "ft_time_span";

-- DropTable
DROP TABLE "ft_time_window";

-- DropTable
DROP TABLE "ft_user_request";

-- DropEnum
DROP TYPE "ft_feedback_subject_type";

-- DropEnum
DROP TYPE "ft_status";

-- DropEnum
DROP TYPE "review_status";

-- CreateTable
CREATE TABLE "assignment_period" (
    "id" SERIAL NOT NULL,
    "mobilization_id" TEXT NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_period_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignment_period_start_idx" ON "assignment_period"("start" ASC);

-- CreateIndex
CREATE INDEX "assignment_period_end_idx" ON "assignment_period"("end" DESC);

-- CreateIndex
CREATE INDEX "assignment_period_start_end_idx" ON "assignment_period"("start" ASC, "end" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "assignment_period_mobilization_id_start_end_key" ON "assignment_period"("mobilization_id", "start", "end");

-- CreateIndex
CREATE UNIQUE INDEX "assignment_period_id_assignee_id_key" ON "assignment"("period_id", "assignee_id");

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "assignment_period"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_user_request_id_ft_id_mobilization_id_fkey" FOREIGN KEY ("user_request_id", "ft_id", "mobilization_id") REFERENCES "festival_task_moblilization_volunteer"("volunteer_id", "mobilization_ft_id", "mobilization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_team_request_id_ft_id_mobilization_id_fkey" FOREIGN KEY ("team_request_id", "ft_id", "mobilization_id") REFERENCES "festival_task_mobilization_team"("team_code", "mobilization_ft_id", "mobilization_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_mobilization_id_ft_id_fkey" FOREIGN KEY ("mobilization_id", "ft_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_period" ADD CONSTRAINT "assignment_period_mobilization_id_ft_id_fkey" FOREIGN KEY ("mobilization_id", "ft_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_period" ADD CONSTRAINT "assignment_period_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
