/*
  Warnings:

  - You are about to drop the `ft` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_team_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_time_span` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_time_window` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ft_user_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `old_assignment` table. If the table is not empty, all the data it contains will be lost.

*/
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

-- DropForeignKey
ALTER TABLE "old_assignment" DROP CONSTRAINT "old_assignment_assignee_id_fkey";

-- DropForeignKey
ALTER TABLE "old_assignment" DROP CONSTRAINT "old_assignment_team_request_id_fkey";

-- DropForeignKey
ALTER TABLE "old_assignment" DROP CONSTRAINT "old_assignment_time_span_id_fkey";

-- DropForeignKey
ALTER TABLE "old_assignment" DROP CONSTRAINT "old_assignment_user_request_id_fkey";

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

-- DropTable
DROP TABLE "old_assignment";

-- DropEnum
DROP TYPE "ft_feedback_subject_type";

-- DropEnum
DROP TYPE "ft_status";

-- DropEnum
DROP TYPE "review_status";

-- DropEnum
DROP TYPE "task_category";
