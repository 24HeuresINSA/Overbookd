-- CreateEnum
CREATE TYPE "FestivalTaskCategory" AS ENUM ('BAR', 'MANUTENTION', 'RELOU', 'STATIQUE', 'FUN');

-- AlterTable
ALTER TABLE "festival_task" ADD COLUMN     "category" "FestivalTaskCategory",
ADD COLUMN     "top_priority" BOOLEAN;
