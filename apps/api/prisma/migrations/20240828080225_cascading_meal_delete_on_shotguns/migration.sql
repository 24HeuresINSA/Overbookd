-- DropForeignKey
ALTER TABLE "shotgun" DROP CONSTRAINT "shotgun_meal_id_fkey";

-- AddForeignKey
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "shared_meal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
