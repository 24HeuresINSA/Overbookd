-- CreateEnum
CREATE TYPE "task_category" AS ENUM ('STATIQUE', 'BAR', 'MANUTENTION', 'ANIMATION', 'NETTOYAGE');

-- AlterTable
ALTER TABLE "ft" ADD COLUMN     "category" "task_category",
ADD COLUMN     "has_priority" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "ft_timespan" ADD COLUMN     "user_requested_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ft_timespan" ADD CONSTRAINT "ft_timespan_user_requested_id_fkey" FOREIGN KEY ("user_requested_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
