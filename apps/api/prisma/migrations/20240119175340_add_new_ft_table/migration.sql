-- CreateEnum
CREATE TYPE "festival_task_status" AS ENUM ('DRAFT', 'IN_REVIEW', 'VALIDATED', 'REFUSED', 'READY');

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

-- CreateTable
CREATE TABLE "festival_task_contact" (
    "contact_id" INTEGER NOT NULL,
    "festival_task_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_contact_pkey" PRIMARY KEY ("contact_id","festival_task_id")
);

-- CreateTable
CREATE TABLE "festival_task_in_charge_volunteer" (
    "contact_id" INTEGER NOT NULL,
    "festival_task_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_in_charge_volunteer_pkey" PRIMARY KEY ("contact_id","festival_task_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "festival_task_id_key" ON "festival_task"("id");

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_administrator_id_fkey" FOREIGN KEY ("administrator_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_festival_activity_id_fkey" FOREIGN KEY ("festival_activity_id") REFERENCES "festival_activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task" ADD CONSTRAINT "festival_task_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "signa_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_contact" ADD CONSTRAINT "festival_task_contact_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_contact" ADD CONSTRAINT "festival_task_contact_festival_task_id_fkey" FOREIGN KEY ("festival_task_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_in_charge_volunteer" ADD CONSTRAINT "festival_task_in_charge_volunteer_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_in_charge_volunteer" ADD CONSTRAINT "festival_task_in_charge_volunteer_festival_task_id_fkey" FOREIGN KEY ("festival_task_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;
