-- CreateEnum
CREATE TYPE "festival_task_status" AS ENUM ('DRAFT', 'IN_REVIEW', 'VALIDATED', 'REFUSED', 'READY');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "festival_task_contact_id" INTEGER,
ADD COLUMN     "festival_task_in_charge_id" INTEGER;

-- CreateTable
CREATE TABLE "festival_task" (
    "id" INTEGER NOT NULL,
    "status" "festival_task_status" NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "administrator_id" INTEGER NOT NULL,
    "team_code" VARCHAR(20),
    "festival_activity_id" INTEGER,
    "appointment_id" INTEGER,
    "global_instruction" TEXT,
    "in_charge_instruction" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "festival_task_id_key" ON "festival_task"("id");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_festival_task_in_charge_id_fkey" FOREIGN KEY ("festival_task_in_charge_id") REFERENCES "festival_task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_festival_task_contact_id_fkey" FOREIGN KEY ("festival_task_contact_id") REFERENCES "festival_task"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_administrator_id_fkey" FOREIGN KEY ("administrator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_festival_activity_id_fkey" FOREIGN KEY ("festival_activity_id") REFERENCES "festival_activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "signa_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
