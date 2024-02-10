
-- AlterTable
ALTER TABLE "feedback" RENAME CONSTRAINT "feedback_author_id_fkey" TO "festival_activity_feedback_author_id_fkey";

-- AlterTable
ALTER TABLE "feedback" RENAME CONSTRAINT "feedback_fa_id_fkey" TO "festival_activity_feedback_fa_id_fkey";

-- AlterTable
ALTER TABLE "feedback" RENAME CONSTRAINT "feedback_pkey" TO "festival_activity_feedback_pkey";

-- RenameTable
ALTER TABLE "feedback" RENAME TO "festival_activity_feedback";

-- CreateTable
CREATE TABLE "festival_task_feedback" (
    "content" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_feedback_pkey" PRIMARY KEY ("ft_id","author_id","published_at")
);

-- AddForeignKey
ALTER TABLE "festival_task_feedback" ADD CONSTRAINT "festival_task_feedback_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_feedback" ADD CONSTRAINT "festival_task_feedback_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

