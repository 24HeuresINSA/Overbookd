import { Module } from "@nestjs/common";
import { GrantPermission } from "@overbookd/access-manager";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { PrismaTeams } from "./repository/teams.prisma";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [MailModule, PrismaModule, UserModule, DomainEventModule],
  controllers: [TeamController],
  providers: [
    {
      provide: PrismaTeams,
      useFactory: (prisma: PrismaService) => new PrismaTeams(prisma),
      inject: [PrismaService],
    },
    {
      provide: GrantPermission,
      useFactory: (teams: PrismaTeams, events: DomainEventService) =>
        new GrantPermission(teams, events),
      inject: [PrismaTeams, DomainEventService],
    },
    {
      provide: TeamService,
      useFactory: (
        prisma: PrismaService,
        user: UserService,
        grantPermission: GrantPermission,
      ) => new TeamService(prisma, user, grantPermission),
      inject: [PrismaService, UserService, GrantPermission],
    },
  ],
})
export class TeamModule {}
