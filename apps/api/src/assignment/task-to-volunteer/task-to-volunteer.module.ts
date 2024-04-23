import { Module } from "@nestjs/common";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { AssignTaskToVolunteer } from "@overbookd/assignment";
import { PrismaService } from "../../prisma.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaAssignableVolunteers } from "./repository/assignable-volunteers.prisma";
import { PrismaTasks } from "../common/repository/tasks.prisma";
import { AssignmentCommonModule } from "../common/assignment-common.module";

@Module({
  providers: [
    {
      provide: PrismaAssignableVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaAssignableVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignTaskToVolunteer,
      useFactory: (
        tasks: PrismaTasks,
        volunteers: PrismaAssignableVolunteers,
      ) => new AssignTaskToVolunteer(tasks, volunteers),
      inject: [PrismaTasks, PrismaAssignableVolunteers],
    },
    {
      provide: TaskToVolunteerService,
      useFactory: (assign: AssignTaskToVolunteer) =>
        new TaskToVolunteerService(assign),
      inject: [AssignTaskToVolunteer],
    },
  ],
  exports: [TaskToVolunteerService],
  imports: [PrismaModule, AssignmentCommonModule],
})
export class TaskToVolunteerModule {}
