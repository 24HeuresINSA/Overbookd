import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaAssignments } from "./repository/assignments.prisma";
import { AssignmentService } from "./assignment.service";
import { PrismaPlanning } from "./repository/planning.prisma";
import { PrismaAssignmentStats } from "./repository/assignment-stats.prisma";
import { DomainEventService } from "../../domain-event/domain-event.service";
import { DomainEventModule } from "../../domain-event/domain-event.module";
import { PrismaTeamAssignments } from "./repository/team-assignments.prisma";
import { WholeTeamAssignments } from "@overbookd/assignment";

@Module({
  providers: [
    {
      provide: PrismaAssignments,
      useFactory: (prisma: PrismaService) => new PrismaAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaAssignmentStats,
      useFactory: (prisma: PrismaService) => new PrismaAssignmentStats(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanning,
      useFactory: (prisma: PrismaService) => new PrismaPlanning(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTeamAssignments,
      useFactory: (prisma: PrismaService) => new PrismaTeamAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: WholeTeamAssignments,
      useFactory: (teamAssignments: PrismaTeamAssignments) =>
        new WholeTeamAssignments(teamAssignments),
      inject: [PrismaTeamAssignments],
    },
    {
      provide: AssignmentService,
      useFactory: (
        assignments: PrismaAssignments,
        stats: PrismaAssignmentStats,
        planning: PrismaPlanning,
        eventStore: DomainEventService,
        wholeTeamAssignments: WholeTeamAssignments,
      ) =>
        new AssignmentService(
          assignments,
          stats,
          planning,
          eventStore,
          wholeTeamAssignments,
        ),
      inject: [
        PrismaAssignments,
        PrismaAssignmentStats,
        PrismaPlanning,
        DomainEventService,
        WholeTeamAssignments,
      ],
    },
  ],
  exports: [AssignmentService],
  imports: [PrismaModule, DomainEventModule],
})
export class AssignmentCommonModule {}
