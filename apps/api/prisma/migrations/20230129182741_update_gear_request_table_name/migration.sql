DROP INDEX "Animation_Gear_Request_status_idx" ;
DROP INDEX "Animation_Gear_Request_gearId_rentalPeriodId_key";

ALTER TABLE "Animation_Gear_Request"
DROP CONSTRAINT "Animation_Gear_Request_rentalPeriodId_fkey",
DROP CONSTRAINT "Animation_Gear_Request_animationId_fkey",
DROP CONSTRAINT "Animation_Gear_Request_taskId_fkey",
DROP CONSTRAINT "Animation_Gear_Request_gearId_fkey";

ALTER TABLE "Animation_Gear_Request" RENAME TO "gear_request";

ALTER TABLE "gear_request"
ADD CONSTRAINT "gear_request_rentalPeriodId_fkey" FOREIGN KEY ("rentalPeriodId") REFERENCES "Period"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "gear_request_animationId_fkey" FOREIGN KEY ("animationId") REFERENCES "fa"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "gear_request_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "ft"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "gear_request_gearId_fkey" FOREIGN KEY ("gearId") REFERENCES "Catalog_Gear"("id") ON DELETE CASCADE ON UPDATE CASCADE;


CREATE INDEX "gear_request_status_idx" ON "gear_request"("status");
CREATE UNIQUE INDEX "gear_request_gearId_rentalPeriodId_key" ON "gear_request"("gearId", "rentalPeriodId");