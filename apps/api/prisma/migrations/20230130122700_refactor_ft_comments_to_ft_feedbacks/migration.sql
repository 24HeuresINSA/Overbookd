/*
  Warnings:

  - You are about to drop the `ft_comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ft_comments" DROP CONSTRAINT "ft_comments_author_id_fkey";

-- DropForeignKey
ALTER TABLE "ft_comments" DROP CONSTRAINT "ft_comments_ft_id_fkey";

-- DropTable
DROP TABLE "ft_comments";

-- CreateTable
CREATE TABLE "ft_feedbacks" (
    "id" SERIAL NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "subject" "ft_subject_type" NOT NULL,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ft_feedbacks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ft_feedbacks" ADD CONSTRAINT "ft_feedbacks_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ft_feedbacks" ADD CONSTRAINT "ft_feedbacks_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
