/*
  Warnings:

  - A unique constraint covering the columns `[animationId,gearId,rentalPeriodId]` on the table `Animation_Gear_Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Animation_Gear_Request_animationId_gearId_key";
DROP INDEX "Animation_Gear_Request_rentalPeriodId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Animation_Gear_Request_animationId_gearId_rentalPeriodId_key" ON "Animation_Gear_Request"("animationId", "gearId", "rentalPeriodId");
