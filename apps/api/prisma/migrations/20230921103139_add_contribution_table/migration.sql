/*
  Warnings:

  - You are about to drop the column `has_payed_contributions` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "has_payed_contributions";

-- CreateTable
CREATE TABLE "contribution" (
    "adherent_id" INTEGER NOT NULL,
    "edition" INTEGER NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "contribution_pkey" PRIMARY KEY ("adherent_id","edition")
);

-- AddForeignKey
ALTER TABLE "contribution" ADD CONSTRAINT "contribution_adherent_id_fkey" FOREIGN KEY ("adherent_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
