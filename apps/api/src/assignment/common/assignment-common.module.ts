import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaAssignments } from "./repository/assignments.prisma";
import { AssignmentService } from "./assignment.service";
import { PrismaPlanning } from "./repository/planning.prisma";
import { PrismaAssignmentStats } from "./repository/assignment-stats.prisma";

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
      provide: AssignmentService,
      useFactory: (
        assignments: PrismaAssignments,
        stats: PrismaAssignmentStats,
        planning: PrismaPlanning,
      ) => new AssignmentService(assignments, stats, planning),
      inject: [PrismaAssignments, PrismaAssignmentStats, PrismaPlanning],
    },
  ],
  exports: [AssignmentService],
  imports: [PrismaModule],
})
export class AssignmentCommonModule {}
