/*
  Warnings:

  - You are about to drop the column `location` on the `FestivalActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FestivalActivity" DROP COLUMN "location",
ADD COLUMN     "location_id" INTEGER;

-- AddForeignKey
ALTER TABLE "FestivalActivity" ADD CONSTRAINT "FestivalActivity_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "signa_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
