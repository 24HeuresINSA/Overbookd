/*
  Warnings:

  - You are about to drop the column `user_requested_id` on the `ft_timespan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ft_timespan" DROP CONSTRAINT "ft_timespan_user_requested_id_fkey";

-- AlterTable
ALTER TABLE "ft_timespan" DROP COLUMN "user_requested_id";
