import { Module } from "@nestjs/common";
import { BreakPeriods } from "@overbookd/planning";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { RegistrationModule } from "../registration/index/registration.module";
import { TeamService } from "../team/team.service";
import { FileService } from "../utils/file.service";
import { PlanningController } from "./planning/planning.controller";
import { PlanningModule } from "./planning/planning.module";
import { PrismaBreaks } from "./planning/repository/breaks.prisma";
import { PrismaPlanningVolunteers } from "./planning/repository/planning-volunteers.prisma";
import { PreferenceController } from "./preference/preference.controller";
import { PreferenceService } from "./preference/preference.service";
import { PrismaPreferences } from "./preference/repository/preferences.prisma";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    PlanningModule,
    RegistrationModule,
    PrismaModule,
    AccessManagerModule,
  ],
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
      provide: PrismaPlanningVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaPlanningVolunteers(prisma),
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
      useFactory: (prisma: PrismaService) => new UserService(prisma),
      inject: [PrismaService],
    },
    FileService,
    ProfilePictureService,
    TeamService,
  ],
  exports: [UserService],
})
export class UserModule {}
