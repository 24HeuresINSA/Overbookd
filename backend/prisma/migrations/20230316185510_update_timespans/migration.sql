/*
  Warnings:

  - Added the required column `category` to the `ft_timespan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('STATIQUE', 'BAR', 'MANUTENTION', 'ANIMATION', 'NETTOYAGE');

-- AlterTable
ALTER TABLE "ft_timespan" ADD COLUMN     "category" "task_category" NOT NULL,
ADD COLUMN     "has_priority" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "user_requested_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ft_timespan" ADD CONSTRAINT "ft_timespan_user_requested_id_fkey" FOREIGN KEY ("user_requested_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
