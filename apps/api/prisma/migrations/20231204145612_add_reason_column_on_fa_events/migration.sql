-- AlterEnum
ALTER TYPE "festival_activity_event" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "festival_activity_history" ADD COLUMN     "reason" TEXT;
