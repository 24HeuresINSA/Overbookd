import { Module } from "@nestjs/common";
import { VolunteerPlanningModule } from "../../src/volunteer-planning/volunteer-planning.module";
import { PrismaService } from "../prisma.service";
import { FileService } from "../utils/file.service";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TeamService } from "../team/team.service";
import { RegistrationModule } from "../registration/registration.module";
import { ForgetMember } from "@overbookd/registration";
import { PrismaModule } from "../prisma.module";
import { PreferenceController } from "./preference.controller";
import { PrismaPreferences } from "./repository/preferences.prisma";
import { PreferenceService } from "./preference.service";

@Module({
  imports: [VolunteerPlanningModule, RegistrationModule, PrismaModule],
  controllers: [UserController, PreferenceController],
  providers: [
    {
      provide: PrismaPreferences,
      useFactory: (prisma: PrismaService) => new PrismaPreferences(prisma),
      inject: [PrismaService],
    },
    {
      provide: PreferenceService,
      useFactory: (preferences: PrismaPreferences) =>
        new PreferenceService(preferences),
      inject: [PrismaPreferences],
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
