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
import { PrismaVolunteersForAssignment } from "./repository/volunteers-for-assignment.prisma";
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
      provide: PrismaVolunteersForAssignment,
      useFactory: (prisma: PrismaService) =>
        new PrismaVolunteersForAssignment(prisma),
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
        volunteersForAssignment: PrismaVolunteersForAssignment,
      ) => new Assign(assignments, volunteersForAssignment),
      inject: [PrismaAssignments, PrismaVolunteersForAssignment],
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
