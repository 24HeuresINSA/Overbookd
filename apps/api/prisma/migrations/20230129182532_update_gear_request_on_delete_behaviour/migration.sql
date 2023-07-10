-- DropForeignKey
ALTER TABLE "Animation_Gear_Request" DROP CONSTRAINT "Animation_Gear_Request_animationId_fkey";

-- DropForeignKey
ALTER TABLE "Animation_Gear_Request" DROP CONSTRAINT "Animation_Gear_Request_gearId_fkey";

-- DropForeignKey
ALTER TABLE "Animation_Gear_Request" DROP CONSTRAINT "Animation_Gear_Request_taskId_fkey";

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "fa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Animation_Gear_Request" ADD CONSTRAINT "Animation_Gear_Request_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Catalog_Gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
