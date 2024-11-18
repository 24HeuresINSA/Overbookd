import { Module } from "@nestjs/common";
import { GrantPermission, JoinTeams } from "@overbookd/access-manager";
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
        joinTeams: JoinTeams,
      ) => new TeamService(prisma, user, grantPermission, joinTeams),
      inject: [PrismaService, UserService, GrantPermission, JoinTeams],
    },
  ],
})
export class TeamModule {}
