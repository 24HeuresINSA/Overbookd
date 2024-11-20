import { Module } from "@nestjs/common";
import {
  GrantPermission,
  JoinTeams,
  LeaveTeam,
  RevokePermission,
} from "@overbookd/access-manager";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaModule } from "../prisma.module";
import { PrismaService } from "../prisma.service";
import { PrismaTeamsGranting } from "./repository/teams-granting.prisma";
import { PrismaMembershipsJoining } from "./repository/memberships-joining.prisma";
import { PrismaMembershipsLeaving } from "./repository/memberships-leaving.prisma";
import { PrismaTeamsRevoking } from "./repository/teams-revoking.prisma";

@Module({
  imports: [PrismaModule, DomainEventModule],
  providers: [
    {
      provide: PrismaTeamsGranting,
      useFactory: (prisma: PrismaService) => new PrismaTeamsGranting(prisma),
      inject: [PrismaService],
    },
    {
      provide: GrantPermission,
      useFactory: (teams: PrismaTeamsGranting, events: DomainEventService) =>
        new GrantPermission(teams, events),
      inject: [PrismaTeamsGranting, DomainEventService],
    },
    {
      provide: PrismaTeamsRevoking,
      useFactory: (prisma: PrismaService) => new PrismaTeamsRevoking(prisma),
      inject: [PrismaService],
    },
    {
      provide: RevokePermission,
      useFactory: (teams: PrismaTeamsRevoking, events: DomainEventService) =>
        new RevokePermission(teams, events),
      inject: [PrismaTeamsRevoking, DomainEventService],
    },
    {
      provide: PrismaMembershipsJoining,
      useFactory: (prisma: PrismaService) =>
        new PrismaMembershipsJoining(prisma),
      inject: [PrismaService],
    },
    {
      provide: JoinTeams,
      useFactory: (
        memberships: PrismaMembershipsJoining,
        events: DomainEventService,
      ) => new JoinTeams(memberships, events),
      inject: [PrismaMembershipsJoining, DomainEventService],
    },
    {
      provide: PrismaMembershipsLeaving,
      useFactory: (prisma: PrismaService) =>
        new PrismaMembershipsLeaving(prisma),
      inject: [PrismaService],
    },
    {
      provide: LeaveTeam,
      useFactory: (
        memberships: PrismaMembershipsLeaving,
        events: DomainEventService,
      ) => new LeaveTeam(memberships, events),
      inject: [PrismaMembershipsLeaving, DomainEventService],
    },
  ],
  exports: [GrantPermission, RevokePermission, JoinTeams, LeaveTeam],
})
export class AccessManagerModule {}
