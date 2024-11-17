import { Module } from "@nestjs/common";
import { GrantPermission } from "@overbookd/access-manager";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PrismaTeams } from "./repository/teams.prisma";

@Module({
  imports: [PrismaModule, DomainEventModule],
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
  ],
  exports: [GrantPermission],
})
export class AccessManagerModule {}
