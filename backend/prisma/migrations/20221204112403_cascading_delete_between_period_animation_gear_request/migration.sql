-- DropForeignKey
ALTER TABLE "Animation_Gear_Request" DROP CONSTRAINT "Animation_Gear_Request_rentalPeriodId_fkey";

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_rentalPeriodId_fkey" FOREIGN KEY ("rentalPeriodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE;
