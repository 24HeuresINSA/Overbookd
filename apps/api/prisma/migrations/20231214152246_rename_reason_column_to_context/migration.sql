/*
  Renaming column `reason` to `context` on the `festival_activity_history` table.

*/
-- AlterTable
ALTER TABLE "festival_activity_history" RENAME COLUMN "reason" TO "context"
