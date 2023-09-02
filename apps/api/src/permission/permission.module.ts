import { Module } from "@nestjs/common";
import { TeamService } from "../../src/team/team.service";
import { UserService } from "../../src/user/user.service";
import { PrismaService } from "../prisma.service";
import { PermissionController } from "./permission.controller";
import { PermissionService } from "./permission.service";
import { MailModule } from "../mail/mail.module";

@Module({
  imports: [MailModule],
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService, TeamService, UserService],
})
export class PermissionModule {}
