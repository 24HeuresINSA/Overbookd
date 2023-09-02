import { Module } from "@nestjs/common";
import { CommonModule } from "../../src/common/common.module";
import { UserService } from "../../src/user/user.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";

@Module({
  imports: [CommonModule, MailModule, PrismaModule],
  controllers: [TeamController],
  providers: [UserService, TeamService],
})
export class TeamModule {}
