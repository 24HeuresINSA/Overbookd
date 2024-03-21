-- CreateTable
CREATE TABLE "assignment" (
    "id" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "mobilization_id" TEXT NOT NULL,
    "festival_task_id" INTEGER NOT NULL,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id","mobilization_id","festival_task_id")
);

-- CreateTable
CREATE TABLE "assignee" (
    "assignment_id" TEXT NOT NULL,
    "mobilization_id" TEXT NOT NULL,
    "festival_task_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "assignee_pkey" PRIMARY KEY ("user_id","assignment_id","mobilization_id","festival_task_id")
);

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_mobilization_id_festival_task_id_fkey" FOREIGN KEY ("mobilization_id", "festival_task_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_festival_task_id_fkey" FOREIGN KEY ("festival_task_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_assignment_id_mobilization_id_festival_task_id_fkey" FOREIGN KEY ("assignment_id", "mobilization_id", "festival_task_id") REFERENCES "assignment"("id", "mobilization_id", "festival_task_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_mobilization_id_festival_task_id_fkey" FOREIGN KEY ("mobilization_id", "festival_task_id") REFERENCES "festival_task_mobilization"("id", "ft_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_festival_task_id_fkey" FOREIGN KEY ("festival_task_id") REFERENCES "festival_task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignee" ADD CONSTRAINT "assignee_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
