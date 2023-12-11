-- AlterTable
ALTER TABLE "festival_activity_signage" ADD COLUMN     "catalogSignageId" INTEGER;

-- AddForeignKey
ALTER TABLE "festival_activity_signage" ADD CONSTRAINT "festival_activity_signage_catalogSignageId_fkey" FOREIGN KEY ("catalogSignageId") REFERENCES "catalog_signage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
