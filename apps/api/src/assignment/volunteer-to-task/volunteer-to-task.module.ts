import { Module } from "@nestjs/common";
import { AssignVolunteerToTask } from "@overbookd/assignment";
import { PrismaService } from "../../prisma.service";
import { PrismaVolunteers } from "./repository/volunteers.prisma";
import { VolunteerToTaskService } from "./volunteer-to-task.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaAvailableAssignments } from "./repository/available-assignments.prisma";

@Module({
  providers: [
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAvailableAssignments,
      useFactory: (prisma: PrismaService) =>
        new PrismaAvailableAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignVolunteerToTask,
      useFactory: (volunteers: PrismaVolunteers) =>
        new AssignVolunteerToTask(volunteers),
      inject: [PrismaVolunteers],
    },
    {
      provide: VolunteerToTaskService,
      useFactory: (
        assign: AssignVolunteerToTask,
        assignments: PrismaAvailableAssignments,
      ) => new VolunteerToTaskService(assign, assignments),
      inject: [AssignVolunteerToTask, PrismaAvailableAssignments],
    },
  ],
  exports: [VolunteerToTaskService],
  imports: [PrismaModule],
})
export class VolunteerToTaskModule {}
