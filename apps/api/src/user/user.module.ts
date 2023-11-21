import { Module } from "@nestjs/common";
import { VolunteerPlanningModule } from "../../src/volunteer-planning/volunteer-planning.module";
import { PrismaService } from "../prisma.service";
import { FileService } from "./file.service";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TeamService } from "../team/team.service";
import { RegistrationModule } from "../registration/registration.module";
import { ForgetMember } from "@overbookd/registration";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [VolunteerPlanningModule, RegistrationModule, PrismaModule],
  controllers: [UserController],
  providers: [
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
