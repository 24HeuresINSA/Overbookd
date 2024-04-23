import { Module } from "@nestjs/common";
import { AssignVolunteerToTask } from "@overbookd/assignment";
import { PrismaService } from "../../prisma.service";
import { PrismaVolunteers } from "./repository/volunteers.prisma";
import { VolunteerToTaskService } from "./volunteer-to-task.service";
import { PrismaModule } from "../../prisma.module";
import { AssignmentCommonModule } from "../common/assignment-common.module";
import { PrismaTasks } from "../common/repository/tasks.prisma";
import { PrismaTaskAssignments } from "./repository/task-assignments.prisma";

@Module({
  providers: [
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTaskAssignments,
      useFactory: (prisma: PrismaService) => new PrismaTaskAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignVolunteerToTask,
      useFactory: (
        volunteers: PrismaVolunteers,
        assignments: PrismaTaskAssignments,
        tasks: PrismaTasks,
      ) => new AssignVolunteerToTask(volunteers, assignments, tasks),
      inject: [PrismaVolunteers, PrismaTaskAssignments, PrismaTasks],
    },
    {
      provide: VolunteerToTaskService,
      useFactory: (assign: AssignVolunteerToTask) =>
        new VolunteerToTaskService(assign),
      inject: [AssignVolunteerToTask],
    },
  ],
  exports: [VolunteerToTaskService],
  imports: [PrismaModule, AssignmentCommonModule],
})
export class VolunteerToTaskModule {}
