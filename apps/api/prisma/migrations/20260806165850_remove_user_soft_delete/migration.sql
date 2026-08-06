/*
  Warnings:

  - You are about to drop the column `is_deleted` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "festival_activity_feedback" DROP CONSTRAINT "festival_activity_feedback_author_id_fkey";

-- DropForeignKey
ALTER TABLE "shared_meal" DROP CONSTRAINT "shared_meal_chef_id_fkey";

-- DropForeignKey
ALTER TABLE "shotgun" DROP CONSTRAINT "shotgun_guest_id_fkey";

-- DropIndex
DROP INDEX "user_is_deleted_idx";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "is_deleted";

-- AddForeignKey
ALTER TABLE "festival_activity_feedback" ADD CONSTRAINT "festival_activity_feedback_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_meal" ADD CONSTRAINT "shared_meal_chef_id_fkey" FOREIGN KEY ("chef_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
