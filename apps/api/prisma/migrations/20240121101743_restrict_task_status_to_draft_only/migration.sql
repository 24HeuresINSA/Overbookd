/*
  Warnings:

  - The values [IN_REVIEW,VALIDATED,REFUSED,READY] on the enum `festival_task_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "festival_task_status_new" AS ENUM ('DRAFT');
ALTER TABLE "festival_task" ALTER COLUMN "status" TYPE "festival_task_status_new" USING ("status"::text::"festival_task_status_new");
ALTER TYPE "festival_task_status" RENAME TO "festival_task_status_old";
ALTER TYPE "festival_task_status_new" RENAME TO "festival_task_status";
DROP TYPE "festival_task_status_old";
COMMIT;
