import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaAssignments } from "./repository/assignments.prisma";
import { AssignmentService } from "./assignment.service";
import { PrismaPlanning } from "./repository/planning.prisma";
import { PrismaTasks } from "./repository/tasks.prisma";

@Module({
  providers: [
    {
      provide: PrismaAssignments,
      useFactory: (prisma: PrismaService) => new PrismaAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTasks,
      useFactory: (prisma: PrismaService) => new PrismaTasks(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanning,
      useFactory: (prisma: PrismaService) => new PrismaPlanning(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignmentService,
      useFactory: (assignments: PrismaAssignments, planning: PrismaPlanning) =>
        new AssignmentService(assignments, planning),
      inject: [PrismaAssignments, PrismaPlanning],
    },
  ],
  exports: [AssignmentService, PrismaAssignments, PrismaTasks],
  imports: [PrismaModule],
})
export class AssignmentCommonModule {}
