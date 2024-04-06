import { Module } from "@nestjs/common";
import { VolunteerAvailabilityService } from "../volunteer-availability/volunteer-availability.service";
import { PrismaService } from "../prisma.service";
import { AssignmentController } from "./assignment.controller";
import { AssignmentService } from "./assignment.service";
import { FtTimeSpanService } from "./ft-time-span.service";
import { VolunteerService } from "./volunteer.service";
import { MailModule } from "../mail/mail.module";
import { UserModule } from "../user/user.module";
import { PrismaVolunteers } from "./repository/volunteers.prisma";
import { UserService } from "../user/user.service";
import { PrismaModule } from "../prisma.module";
import { VolunteerAvailabilityModule } from "../volunteer-availability/volunteer-availability.module";
import { PrismaTaskPeriods } from "./repository/task-periods.prisma";
import { TaskPeriodService } from "./task-period.service";

@Module({
  controllers: [AssignmentController],
  providers: [
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTaskPeriods,
      useFactory: (prisma: PrismaService) => new PrismaTaskPeriods(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignmentService,
      useFactory: (prisma: PrismaService) => new AssignmentService(prisma),
      inject: [PrismaService],
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
        volunteers: PrismaVolunteers,
      ) => new VolunteerService(prisma, ftTimeSpan, { volunteers }),
      inject: [PrismaService, FtTimeSpanService, PrismaVolunteers],
    },
    {
      provide: TaskPeriodService,
      useFactory: (taskPeriods: PrismaTaskPeriods) =>
        new TaskPeriodService(taskPeriods),
      inject: [PrismaTaskPeriods],
    },
  ],
  imports: [PrismaModule, MailModule, UserModule, VolunteerAvailabilityModule],
})
export class AssignmentModule {}
