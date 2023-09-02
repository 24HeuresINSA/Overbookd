import { Module } from "@nestjs/common";
import { VolunteerPlanningModule } from "../../src/volunteer-planning/volunteer-planning.module";
import { PrismaService } from "../prisma.service";
import { FileService } from "./file.service";
import { ProfilePictureService } from "./profile-picture.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [VolunteerPlanningModule, MailModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, FileService, ProfilePictureService],
})
export class UserModule {}
