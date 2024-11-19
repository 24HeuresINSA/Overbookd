import { Module } from "@nestjs/common";
import {
  GrantPermission,
  JoinTeams,
  LeaveTeam,
  RevokePermission,
} from "@overbookd/access-manager";
import { AccessManagerModule } from "../access-manager/access-manager.module";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { MailModule } from "../mail/mail.module";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { TeamController } from "./team.controller";
import { TeamService } from "./team.service";

@Module({
  imports: [
    MailModule,
    PrismaModule,
    UserModule,
    DomainEventModule,
    AccessManagerModule,
  ],
  controllers: [TeamController],
  providers: [
    {
      provide: TeamService,
      useFactory: (
        prisma: PrismaService,
        user: UserService,
        grantPermission: GrantPermission,
        revokePermission: RevokePermission,
        joinTeams: JoinTeams,
        leaveTeam: LeaveTeam,
      ) =>
        new TeamService(
          prisma,
          user,
          grantPermission,
          revokePermission,
          joinTeams,
          leaveTeam,
        ),
      inject: [
        PrismaService,
        UserService,
        GrantPermission,
        JoinTeams,
        LeaveTeam,
      ],
    },
  ],
})
export class TeamModule {}
