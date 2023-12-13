/*
  Warnings:

  - You are about to drop the column `catalogSignageId` on the `festival_activity_signage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "festival_activity_signage" DROP CONSTRAINT "festival_activity_signage_catalogSignageId_fkey";

-- AlterTable
ALTER TABLE "festival_activity_signage" DROP COLUMN "catalogSignageId",
ADD COLUMN     "catalogItemId" INTEGER;

-- AddForeignKey
ALTER TABLE "festival_activity_signage" ADD CONSTRAINT "festival_activity_signage_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "catalog_signage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
