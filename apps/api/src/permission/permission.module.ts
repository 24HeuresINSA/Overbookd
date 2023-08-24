import { Module } from "@nestjs/common";
import { MailService } from "../../src/mail/mail.service";
import { TeamService } from "../../src/team/team.service";
import { UserService } from "../../src/user/user.service";
import { PrismaService } from "../prisma.service";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";

@Module({
  imports: [],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PrismaService,
    TeamService,
    UserService,
    MailService,
  ],
})
export class PermissionModule {}
