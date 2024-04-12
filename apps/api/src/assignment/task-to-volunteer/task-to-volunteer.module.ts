import { Module } from "@nestjs/common";
import { TaskToVolunteerService } from "./task-to-volunteer.service";
import { AssignTaskToVolunteer } from "@overbookd/assignment";
import { PrismaTasks } from "./repository/tasks.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaModule } from "../../prisma.module";

@Module({
  providers: [
    {
      provide: PrismaTasks,
      useFactory: (prisma: PrismaService) => new PrismaTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignTaskToVolunteer,
      useFactory: (tasks: PrismaTasks) => new AssignTaskToVolunteer(tasks),
      inject: [PrismaTasks],
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