import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { PrismaAssignments } from "./repository/assignments.prisma";
import { AssignmentService } from "./assignment.service";

@Module({
  providers: [
    {
      provide: PrismaAssignments,
      useFactory: (prisma: PrismaService) => new PrismaAssignments(prisma),
      inject: [PrismaService],
    },
    {
      provide: AssignmentService,
      useFactory: (assignments: PrismaAssignments) =>
        new AssignmentService(assignments),
      inject: [PrismaAssignments],
    },
  ],
  exports: [AssignmentService],
  imports: [PrismaModule],
})
export class AssignmentCommonModule {}
