import { Module } from "@nestjs/common";
import { AssignTaskToVolunteer } from "@overbookd/assignment";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaAssignableVolunteers } from "./repository/assignable-volunteers.prisma";
import { PrismaTasks } from "./repository/tasks.prisma";
import { TaskToVolunteerService } from "./task-to-volunteer.service";

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
