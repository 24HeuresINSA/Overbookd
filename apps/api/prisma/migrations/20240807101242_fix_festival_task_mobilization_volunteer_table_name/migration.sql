-- AlterTable
ALTER TABLE "festival_task_moblilization_volunteer" RENAME TO "festival_task_mobilization_volunteer";

-- AlterTable
ALTER TABLE "festival_task_mobilization_volunteer" RENAME CONSTRAINT "festival_task_moblilization_volunteer_pkey" TO "festival_task_mobilization_volunteer_pkey";

-- RenameForeignKey
ALTER TABLE "festival_task_mobilization_volunteer" RENAME CONSTRAINT "festival_task_moblilization_volunteer_mobilization_id_mobi_fkey" TO "festival_task_mobilization_volunteer_mobilization_id_mobil_fkey";

-- RenameForeignKey
ALTER TABLE "festival_task_mobilization_volunteer" RENAME CONSTRAINT "festival_task_moblilization_volunteer_volunteer_id_fkey" TO "festival_task_mobilization_volunteer_volunteer_id_fkey";
