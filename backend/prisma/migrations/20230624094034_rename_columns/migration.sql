ALTER TABLE "assignment" RENAME COLUMN "timespanId" TO "timespan_id";
ALTER TABLE "gear_request" RENAME COLUMN "animationId" TO "animation_id";
ALTER TABLE "gear_request" RENAME COLUMN "taskId" TO "task_id";
ALTER TABLE "gear_request" RENAME COLUMN "rentalPeriodId" TO "rental_period_id";
ALTER TABLE "gear_request" RENAME COLUMN "gearId" TO "gear_id";
ALTER TABLE "fa_site_publish_animation" RENAME COLUMN "photo_link " TO "photo_link";

-- RenameForeignKey
ALTER TABLE "assignment" RENAME CONSTRAINT "assignment_timespanId_fkey" TO "assignment_timespan_id_fkey";

-- RenameForeignKey
ALTER TABLE "gear_request" RENAME CONSTRAINT "gear_request_animationId_fkey" TO "gear_request_animation_id_fkey";

-- RenameForeignKey
ALTER TABLE "gear_request" RENAME CONSTRAINT "gear_request_gearId_fkey" TO "gear_request_gear_id_fkey";

-- RenameForeignKey
ALTER TABLE "gear_request" RENAME CONSTRAINT "gear_request_rentalPeriodId_fkey" TO "gear_request_rental_period_id_fkey";

-- RenameForeignKey
ALTER TABLE "gear_request" RENAME CONSTRAINT "gear_request_taskId_fkey" TO "gear_request_task_id_fkey";

-- RenameIndex
ALTER INDEX "assignment_timespanId_assignee_id_key" RENAME TO "assignment_timespan_id_assignee_id_key";

-- RenameIndex
ALTER INDEX "gear_request_gearId_rentalPeriodId_key" RENAME TO "gear_request_gear_id_rental_period_id_key";