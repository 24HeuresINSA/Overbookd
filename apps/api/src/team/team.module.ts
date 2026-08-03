import { Module } from "@nestjs/common";
import { JoinTeams, LeaveTeam } from "@overbookd/access-manager";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [MailModule, PrismaModule, DomainEventModule, AccessManagerModule],
  controllers: [TeamController],
  providers: [
    {
      provide: TeamService,
      useFactory: (
        prisma: PrismaService,
        joinTeams: JoinTeams,
        leaveTeam: LeaveTeam,
      ) => new TeamService(prisma, joinTeams, leaveTeam),
      inject: [PrismaService, JoinTeams, LeaveTeam],
    },
  ],
})
export class TeamModule {}
