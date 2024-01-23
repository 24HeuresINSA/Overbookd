-- CreateTable
CREATE TABLE "festival_task_mobilization" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "duration_split_in_hour" INTEGER,
    "ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_mobilization_pkey" PRIMARY KEY ("ft_id","id")
);

-- CreateTable
CREATE TABLE "festival_task_moblilization_volunteer" (
    "volunteer_id" INTEGER NOT NULL,
    "mobilization_id" TEXT NOT NULL,
    "mobilization_ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_moblilization_volunteer_pkey" PRIMARY KEY ("volunteer_id","mobilization_id","mobilization_ft_id")
);

-- CreateTable
CREATE TABLE "festival_task_mobilization_team" (
    "count" INTEGER NOT NULL,
    "team_code" TEXT NOT NULL,
    "mobilization_id" TEXT NOT NULL,
    "mobilization_ft_id" INTEGER NOT NULL,

    CONSTRAINT "festival_task_mobilization_team_pkey" PRIMARY KEY ("team_code","mobilization_id","mobilization_ft_id")
);

-- AddForeignKey
ALTER TABLE "festival_task_mobilization" ADD CONSTRAINT "festival_task_mobilization_ft_id_fkey" FOREIGN KEY ("ft_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_moblilization_volunteer" ADD CONSTRAINT "festival_task_moblilization_volunteer_volunteer_id_fkey" FOREIGN KEY ("volunteer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_moblilization_volunteer" ADD CONSTRAINT "festival_task_moblilization_volunteer_mobilization_id_mobi_fkey" FOREIGN KEY ("mobilization_id", "mobilization_ft_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_mobilization_team" ADD CONSTRAINT "festival_task_mobilization_team_team_code_fkey" FOREIGN KEY ("team_code") REFERENCES "team"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "festival_task_mobilization_team" ADD CONSTRAINT "festival_task_mobilization_team_mobilization_id_mobilizati_fkey" FOREIGN KEY ("mobilization_id", "mobilization_ft_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;
