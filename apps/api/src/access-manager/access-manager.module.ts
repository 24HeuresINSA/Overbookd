import { Module } from "@nestjs/common";
import { GrantPermission, JoinTeams } from "@overbookd/access-manager";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PrismaTeams } from "./repository/teams.prisma";
import { PrismaMemberships } from "./repository/memberships.prisma";

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
    {
      provide: PrismaMemberships,
      useFactory: (prisma: PrismaService) => new PrismaMemberships(prisma),
      inject: [PrismaService],
    },
    {
      provide: JoinTeams,
      useFactory: (
        memberships: PrismaMemberships,
        events: DomainEventService,
      ) => new JoinTeams(memberships, events),
      inject: [PrismaMemberships, DomainEventService],
    },
  ],
  exports: [GrantPermission, JoinTeams],
})
export class AccessManagerModule {}
