import { Module } from "@nestjs/common";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [MailModule, PrismaModule, UserModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
