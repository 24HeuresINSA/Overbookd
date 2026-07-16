import { Module } from "@nestjs/common";
import { VolunteerToTaskController } from "./volunteer-to-task/volunteer-to-task.controller";
import { TaskToVolunteerController } from "./task-to-volunteer/task-to-volunteer.controller";
import { VolunteerToTaskModule } from "./volunteer-to-task/volunteer-to-task.module";
import { TaskToVolunteerModule } from "./task-to-volunteer/task-to-volunteer.module";
import { AssignmentCommonModule } from "./common/assignment-common.module";
import { AssignmentController } from "./common/assignment.controller";
import { PrismaModule } from "../prisma.module";

@Module({
  controllers: [
    AssignmentController,
    VolunteerToTaskController,
    TaskToVolunteerController,
  ],
  imports: [
    AssignmentCommonModule,
    VolunteerToTaskModule,
    TaskToVolunteerModule,
    PrismaModule,
  ],
})
export class AssignmentModule {}
