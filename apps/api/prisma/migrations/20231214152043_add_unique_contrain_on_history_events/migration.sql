/*
  Warnings:

  - A unique constraint covering the columns `[fa_id,event,instigatorId,at]` on the table `festival_activity_history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "festival_activity_event" ADD VALUE 'COMMENTED';

-- CreateIndex
CREATE UNIQUE INDEX "festival_activity_history_fa_id_event_instigatorId_at_key" ON "festival_activity_history"("fa_id", "event", "instigatorId", "at");
