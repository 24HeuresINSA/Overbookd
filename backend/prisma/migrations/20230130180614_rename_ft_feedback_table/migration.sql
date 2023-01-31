/*
  Warnings:

  - You are about to drop the `ft_feedbacks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ft_feedbacks" DROP CONSTRAINT "ft_feedbacks_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_feedbacks" DROP CONSTRAINT "ft_feedbacks_ft_id_fkey";

-- DropTable
DROP TABLE "ft_feedbacks";

-- CreateTable
CREATE TABLE "ft_feedback" (
    "id" SERIAL NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "ft_subject_type" NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ft_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ft_feedback" ADD CONSTRAINT "ft_feedback_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_feedback" ADD CONSTRAINT "ft_feedback_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
