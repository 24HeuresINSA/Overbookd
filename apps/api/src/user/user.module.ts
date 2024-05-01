import { Module } from "@nestjs/common";
import { BreakPeriods } from "@overbookd/planning";
import { ForgetMember } from "@overbookd/registration";
import { PrismaService } from "../prisma.service";
import { FileService } from "../utils/file.service";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TeamService } from "../team/team.service";
import { RegistrationModule } from "../registration/registration.module";
import { PrismaModule } from "../prisma.module";
import { PreferenceController } from "./preference.controller";
import { PrismaPreferences } from "./repository/preferences.prisma";
import { PreferenceService } from "./preference.service";
import { PrismaBreaks } from "./planning/repository/breaks.prisma";
import { PrismaVolunteers } from "./planning/repository/volunteers.prisma";
import { PlanningModule } from "./planning/planning.module";
import { PlanningController } from "./planning/planning.contoller";

@Module({
  imports: [PlanningModule, RegistrationModule, PrismaModule],
  controllers: [UserController, PreferenceController, PlanningController],
  providers: [
    {
      provide: PrismaPreferences,
      useFactory: (prisma: PrismaService) => new PrismaPreferences(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaBreaks,
      useFactory: (prisma: PrismaService) => new PrismaBreaks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PreferenceService,
      useFactory: (preferences: PrismaPreferences) =>
        new PreferenceService(preferences),
      inject: [PrismaPreferences],
    },
    {
      provide: BreakPeriods,
      useFactory: (breaks: PrismaBreaks) => new BreakPeriods(breaks),
      inject: [PrismaBreaks],
    },
    {
      provide: UserService,
      useFactory: (prisma: PrismaService, forgetMember: ForgetMember) =>
        new UserService(prisma, forgetMember),
      inject: [PrismaService, ForgetMember],
    },
    FileService,
    ProfilePictureService,
    TeamService,
  ],
  exports: [UserService],
})
export class UserModule {}
