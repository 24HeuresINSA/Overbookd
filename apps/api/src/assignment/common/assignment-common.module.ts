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
import { PrismaAvailabilities } from "./repository/availabilities.prisma";
import { PrismaBreakPeriods } from "./repository/break-periods.prisma";
import { PrismaVolunteers } from "../volunteer-to-task/repository/volunteers.prisma";
import { Assign, AssignWholeTeam, Unassign } from "@overbookd/assignment";

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
      provide: PrismaAvailabilities,
      useFactory: (prisma: PrismaService) => new PrismaAvailabilities(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaBreakPeriods,
      useFactory: (prisma: PrismaService) => new PrismaBreakPeriods(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaVolunteers,
      useFactory: (prisma: PrismaService) => new PrismaVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignWholeTeam,
      useFactory: (teamAssignments: PrismaTeamAssignments) =>
        new AssignWholeTeam(teamAssignments),
      inject: [PrismaTeamAssignments],
    },
    {
      provide: Assign,
      useFactory: (
        assignments: PrismaAssignments,
        allVolunteers: PrismaVolunteers,
        availabilities: PrismaAvailabilities,
        breakPeriods: PrismaBreakPeriods,
      ) => new Assign(assignments, allVolunteers, availabilities, breakPeriods),
      inject: [
        PrismaAssignments,
        PrismaVolunteers,
        PrismaAvailabilities,
        PrismaBreakPeriods,
      ],
    },
    {
      provide: Unassign,
      useFactory: (assignments: PrismaAssignments) => new Unassign(assignments),
      inject: [PrismaAssignments],
    },
    {
      provide: AssignmentService,
      useFactory: (
        assignments: PrismaAssignments,
        stats: PrismaAssignmentStats,
        planning: PrismaPlanning,
        eventStore: DomainEventService,
        assignWholeTeam: AssignWholeTeam,
        assignVolunteers: Assign,
        unassignVolunteer: Unassign,
      ) =>
        new AssignmentService(
          assignments,
          stats,
          planning,
          eventStore,
          assignWholeTeam,
          assignVolunteers,
          unassignVolunteer,
        ),
      inject: [
        PrismaAssignments,
        PrismaAssignmentStats,
        PrismaPlanning,
        DomainEventService,
        AssignWholeTeam,
        Assign,
        Unassign,
      ],
    },
  ],
  exports: [AssignmentService],
  imports: [PrismaModule, DomainEventModule],
})
export class AssignmentCommonModule {}
