import { Module } from "@nestjs/common";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { AssignTaskToVolunteer } from "@overbookd/assignment";
import { PrismaTasks } from "../common/repository/tasks.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaAssignableVolunteers } from "./repository/assignable-volunteers.prisma";

@Module({
  providers: [
    {
      provide: PrismaTasks,
      useFactory: (prisma: PrismaService) => new PrismaTasks(prisma),
      inject: [PrismaService],
    },
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
  imports: [PrismaModule],
})
export class TaskToVolunteerModule {}
