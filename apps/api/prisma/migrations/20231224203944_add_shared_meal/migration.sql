-- CreateTable
CREATE TABLE "SharedMeal" (
    "id" SERIAL NOT NULL,
    "menu" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "chef_id" INTEGER NOT NULL,
    "amount" INTEGER,
    "payed_at" TIMESTAMP(3),

    CONSTRAINT "SharedMeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shotgun" (
    "guest_id" INTEGER NOT NULL,
    "meal_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shotgun_pkey" PRIMARY KEY ("guest_id","meal_id")
);

-- AddForeignKey
ALTER TABLE "SharedMeal" ADD CONSTRAINT "SharedMeal_chef_id_fkey" FOREIGN KEY ("chef_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shotgun" ADD CONSTRAINT "Shotgun_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shotgun" ADD CONSTRAINT "Shotgun_meal_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "SharedMeal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
