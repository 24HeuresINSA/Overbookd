import { Module } from "@nestjs/common";
import { VolunteerAvailabilityService } from "../volunteer-availability/volunteer-availability.service";
import { PrismaService } from "../prisma.service";
import { AssignmentController } from "./assignment.controller";
import { AssignmentService } from "./assignment.service";
import { FtTimeSpanService } from "./ft-time-span.service";
import { VolunteerService } from "./volunteer.service";
import { MailModule } from "../mail/mail.module";
import { UserModule } from "../user/user.module";
import { PrismaAssignees } from "./repository/assignees.prisma";
import { UserService } from "../user/user.service";
import { PrismaModule } from "../prisma.module";
import { VolunteerAvailabilityModule } from "../volunteer-availability/volunteer-availability.module";
import { TaskService } from "./task.service";
import {
  AssignmentDurationAssignee,
  MissingAssignmentTasks,
} from "@overbookd/assignment";
import { PrismaAssignedTasks } from "./repository/assigned-tasks.prisma";

@Module({
  controllers: [AssignmentController],
  providers: [
    {
      provide: PrismaAssignees,
      useFactory: (prisma: PrismaService) => new PrismaAssignees(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAssignedTasks,
      useFactory: (prisma: PrismaService) => new PrismaAssignedTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignmentService,
      useFactory: (prisma: PrismaService) => new AssignmentService(prisma),
      inject: [PrismaService],
    },
    {
      provide: MissingAssignmentTasks,
      useFactory: (tasks: PrismaAssignedTasks) =>
        new MissingAssignmentTasks(tasks),
      inject: [PrismaAssignedTasks],
    },
    {
      provide: AssignmentDurationAssignee,
      useFactory: (tasks: PrismaAssignees) =>
        new AssignmentDurationAssignee(tasks),
      inject: [PrismaAssignees],
    },
    {
      provide: FtTimeSpanService,
      useFactory: (
        prisma: PrismaService,
        availabilities: VolunteerAvailabilityService,
        user: UserService,
      ) => new FtTimeSpanService(prisma, availabilities, user),
      inject: [PrismaService, VolunteerAvailabilityService, UserService],
    },
    {
      provide: VolunteerService,
      useFactory: (
        prisma: PrismaService,
        ftTimeSpan: FtTimeSpanService,
        assignmentDurationAssignee: AssignmentDurationAssignee,
      ) =>
        new VolunteerService(prisma, ftTimeSpan, {
          assignmentDurationAssignee,
        }),
      inject: [PrismaService, FtTimeSpanService, AssignmentDurationAssignee],
    },
    {
      provide: TaskService,
      useFactory: (tasks: MissingAssignmentTasks) => new TaskService(tasks),
      inject: [MissingAssignmentTasks],
    },
  ],
  imports: [PrismaModule, MailModule, UserModule, VolunteerAvailabilityModule],
})
export class AssignmentModule {}
