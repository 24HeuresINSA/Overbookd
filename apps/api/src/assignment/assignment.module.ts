import { Module } from "@nestjs/common";
import { VolunteerToTaskController } from "./volunteer-to-task/volunteer-to-task.controller";
import { TaskToVolunteerController } from "./task-to-volunteer/task-to-volunteer.controller";
import { VolunteerToTaskModule } from "./volunteer-to-task/volunteer-to-task.module";
import { TaskToVolunteerModule } from "./task-to-volunteer/task-to-volunteer.module";

@Module({
  controllers: [VolunteerToTaskController, TaskToVolunteerController],
  imports: [VolunteerToTaskModule, TaskToVolunteerModule],
})
export class AssignmentModule {}
