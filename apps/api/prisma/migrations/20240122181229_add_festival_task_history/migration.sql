-- CreateEnum
CREATE TYPE "festival_task_event" AS ENUM ('CREATED');

-- CreateTable
CREATE TABLE "festival_task_history" (
    "id" SERIAL NOT NULL,
    "event" "festival_task_event" NOT NULL,
    "instigatorId" INTEGER NOT NULL,
    "fa_id" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "context" TEXT,

    CONSTRAINT "festival_task_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "festival_task_history_fa_id_event_instigatorId_at_key" ON "festival_task_history"("fa_id", "event", "instigatorId", "at");

-- AddForeignKey
ALTER TABLE "festival_task_history" ADD CONSTRAINT "festival_task_history_instigatorId_fkey" FOREIGN KEY ("instigatorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_history" ADD CONSTRAINT "festival_task_history_fa_id_fkey" FOREIGN KEY ("fa_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
