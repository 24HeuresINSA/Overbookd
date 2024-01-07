-- AlterEnum
ALTER TYPE "transaction_type" ADD VALUE 'SHARED_MEAL';

-- DropForeignKey
ALTER TABLE "SharedMeal" DROP CONSTRAINT "SharedMeal_chef_id_fkey";

-- DropForeignKey
ALTER TABLE "Shotgun" DROP CONSTRAINT "Shotgun_guest_id_fkey";

-- DropForeignKey
ALTER TABLE "Shotgun" DROP CONSTRAINT "Shotgun_meal_id_fkey";

-- DropPrimaryKey
ALTER TABLE "SharedMeal" DROP CONSTRAINT "SharedMeal_pkey";

-- DropPrimaryKey
ALTER TABLE "Shotgun" DROP CONSTRAINT "Shotgun_pkey";

-- Rename Table
ALTER TABLE "SharedMeal" RENAME TO "shared_meal";

-- Rename Table
ALTER TABLE "Shotgun" RENAME TO "shotgun";

-- AddPrimaryKey
ALTER TABLE "shared_meal" ADD CONSTRAINT "shared_meal_pkey" PRIMARY KEY ("id");

-- AddPrimaryKey
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_pkey" PRIMARY KEY ("guest_id","meal_id");

-- AddForeignKey
ALTER TABLE "shared_meal" ADD CONSTRAINT "shared_meal_chef_id_fkey" FOREIGN KEY ("chef_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shotgun" ADD CONSTRAINT "shotgun_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "shared_meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
