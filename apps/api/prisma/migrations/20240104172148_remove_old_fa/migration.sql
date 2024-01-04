/*
  Warnings:

  - You are about to drop the column `animation_id` on the `gear_request` table. All the data in the column will be lost.
  - You are about to drop the `collaborator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_electricity_need` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_feedback` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_signa_need` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fa_time_window` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `public_animation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `gear_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `period` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `catalog_signage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_collaborator_id_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_location_id_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_team_code_fkey";

-- DropForeignKey
ALTER TABLE "fa" DROP CONSTRAINT "fa_user_in_charge_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_electricity_need" DROP CONSTRAINT "fa_electricity_need_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_feedback" DROP CONSTRAINT "fa_feedback_author_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_feedback" DROP CONSTRAINT "fa_feedback_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_signa_need" DROP CONSTRAINT "fa_signa_need_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "fa_time_window" DROP CONSTRAINT "fa_time_window_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "ft" DROP CONSTRAINT "ft_parent_fa_id_fkey";

-- DropForeignKey
ALTER TABLE "gear_request" DROP CONSTRAINT "gear_request_animation_id_fkey";

-- DropForeignKey
ALTER TABLE "public_animation" DROP CONSTRAINT "public_animation_fa_id_fkey";

-- AlterTable
ALTER TABLE "catalog_signage" DROP COLUMN "type",
ADD COLUMN     "type" "signage_type" NOT NULL;

-- AlterTable
ALTER TABLE "gear_request" DROP COLUMN "animation_id";

-- DropTable
DROP TABLE "collaborator";

-- DropTable
DROP TABLE "fa";

-- DropTable
DROP TABLE "fa_electricity_need";

-- DropTable
DROP TABLE "fa_feedback";

-- DropTable
DROP TABLE "fa_signa_need";

-- DropTable
DROP TABLE "fa_time_window";

-- DropTable
DROP TABLE "public_animation";

-- DropEnum
DROP TYPE "animation_category";

-- DropEnum
DROP TYPE "fa_feedback_subject_type";

-- DropEnum
DROP TYPE "fa_status";

-- DropEnum
DROP TYPE "fa_type";

-- DropEnum
DROP TYPE "signa_type";

-- AddForeignKey
ALTER TABLE "ft" ADD CONSTRAINT "ft_parent_fa_id_fkey" FOREIGN KEY ("parent_fa_id") REFERENCES "festival_activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropEnum
DROP TYPE "electricity_type";

-- DropForeignKey
ALTER TABLE "gear_request" DROP CONSTRAINT "gear_request_gear_id_fkey";

-- DropForeignKey
ALTER TABLE "gear_request" DROP CONSTRAINT "gear_request_rental_period_id_fkey";

-- DropForeignKey
ALTER TABLE "gear_request" DROP CONSTRAINT "gear_request_task_id_fkey";

-- DropTable
DROP TABLE "gear_request";

-- DropTable
DROP TABLE "period";
