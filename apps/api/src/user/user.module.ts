import { Module } from "@nestjs/common";
import { VolunteerPlanningModule } from "../../src/volunteer-planning/volunteer-planning.module";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma.service";
import { FileService } from "./file.service";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [VolunteerPlanningModule],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    MailService,
    FileService,
    ProfilePictureService,
  ],
})
export class UserModule {}
