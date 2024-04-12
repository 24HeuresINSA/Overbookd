import { Module } from "@nestjs/common";
import { AssignVolunteerToTask } from "@overbookd/assignment";
import { PrismaService } from "../../prisma.service";
import { PrismaVolunteers } from "./repository/volunteers.prisma";
import { VolunteerToTaskService } from "./volunteer-to-task.service";
import { PrismaModule } from "../../prisma.module";

@Module({
  providers: [
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
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
      useFactory: (assign: AssignVolunteerToTask) =>
        new VolunteerToTaskService(assign),
      inject: [AssignVolunteerToTask],
    },
  ],
  exports: [VolunteerToTaskService],
  imports: [PrismaModule],
})
export class VolunteerToTaskModule {}
