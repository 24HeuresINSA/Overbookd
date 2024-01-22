-- CreateEnum
CREATE TYPE "festival_task_event" AS ENUM ('CREATED');

-- CreateTable
CREATE TABLE "festival_task_history" (
    "id" SERIAL NOT NULL,
    "event" "festival_task_event" NOT NULL,
    "instigator_id" INTEGER NOT NULL,
    "ft_id" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "at" TIMESTAMP(3) NOT NULL,
    "context" TEXT,

    CONSTRAINT "festival_task_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "festival_task_history_ft_id_event_instigator_id_at_key" ON "festival_task_history"("ft_id", "event", "instigator_id", "at");

-- AddForeignKey
ALTER TABLE "festival_task_history" ADD CONSTRAINT "festival_task_history_instigator_id_fkey" FOREIGN KEY ("instigator_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_history" ADD CONSTRAINT "festival_task_history_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
