/*
  Warnings:

  - A unique constraint covering the columns `[gearId,rentalPeriodId]` on the table `Animation_Gear_Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Animation_Gear_Request" DROP CONSTRAINT "Animation_Gear_Request_animationId_fkey";

-- DropIndex
DROP INDEX "Animation_Gear_Request_animationId_gearId_rentalPeriodId_key";

-- AlterTable
ALTER TABLE "Animation_Gear_Request" ADD COLUMN     "taskId" INTEGER,
ALTER COLUMN "animationId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Animation_Gear_Request_gearId_rentalPeriodId_key" ON "Animation_Gear_Request"("gearId", "rentalPeriodId");

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "fa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ft"("id") ON DELETE SET NULL ON UPDATE CASCADE;
