import { Module } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { VolunteerAvailabilityService } from "../volunteer-availability/volunteer-availability.service";
import { PrismaService } from "../prisma.service";
import { AssignmentController } from "./assignment.controller";
import { AssignmentService } from "./assignment.service";
import { FtTimeSpanService } from "./ft-time-span.service";
import { VolunteerService } from "./volunteer.service";
import { MailModule } from "../mail/mail.module";

@Module({
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    VolunteerService,
    FtTimeSpanService,
    PrismaService,
    VolunteerAvailabilityService,
    UserService,
  ],
  imports: [MailModule],
})
export class AssignmentModule {}
