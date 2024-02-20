-- CreateEnum
CREATE TYPE "festival_task_reviewer" AS ENUM ('humain', 'matos', 'elec');

-- CreateEnum
CREATE TYPE "festival_task_review_status" AS ENUM ('REVIEWING', 'NOT_ASKING_TO_REVIEW');

-- AlterTable
ALTER TABLE "festival_task" ADD COLUMN     "reviewer_id" INTEGER;

-- CreateTable
CREATE TABLE "festival_task_review" (
    "team" "festival_task_reviewer" NOT NULL,
    "status" "festival_task_review_status" NOT NULL,
    "ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_review_pkey" PRIMARY KEY ("ft_id","team")
);

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_review" ADD CONSTRAINT "festival_task_review_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
