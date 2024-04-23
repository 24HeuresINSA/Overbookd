import { Module } from "@nestjs/common";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { AssignTaskToVolunteer } from "@overbookd/assignment";
import { PrismaTasks } from "./repository/tasks.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaModule } from "../../prisma.module";
import { PrismaAssignableVolunteers } from "./repository/assignable-volunteers.prisma";
import { PrismaFriends } from "./repository/friends.prisma";

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
      provide: PrismaFriends,
      useFactory: (prisma: PrismaService) => new PrismaFriends(prisma),
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
      useFactory: (assign: AssignTaskToVolunteer, friends: PrismaFriends) =>
        new TaskToVolunteerService(assign, friends),
      inject: [AssignTaskToVolunteer, PrismaFriends],
    },
  ],
  exports: [TaskToVolunteerService],
  imports: [PrismaModule],
})
export class TaskToVolunteerModule {}
