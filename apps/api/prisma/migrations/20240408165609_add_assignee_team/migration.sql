-- AlterTable
ALTER TABLE "assignee" ADD COLUMN     "team_code" TEXT;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_team_code_mobilization_id_festival_task_id_fkey" FOREIGN KEY ("team_code", "mobilization_id", "festival_task_id") REFERENCES "festival_task_mobilization_team"("team_code", "mobilization_id", "mobilization_ft_id") ON DELETE CASCADE ON UPDATE CASCADE;
