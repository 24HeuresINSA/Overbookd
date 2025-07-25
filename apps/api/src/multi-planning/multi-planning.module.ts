import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { MultiPlanningController } from "./multi-planning.controller";
import { PrismaMultiPlanningVolunteers } from "./volunteer.repository.prisma";
import { MultiPlanningService } from "./multi-planning.service";
import { PrismaModule } from "../prisma.module";

@Module({
  controllers: [MultiPlanningController],
  providers: [
    {
      provide: PrismaMultiPlanningVolunteers,
      useFactory: (prisma: PrismaService) =>
        new PrismaMultiPlanningVolunteers(prisma),
      inject: [PrismaService],
    },
    {
      provide: MultiPlanningService,
      useFactory: (volunteers: PrismaMultiPlanningVolunteers) =>
        new MultiPlanningService(volunteers),
      inject: [PrismaMultiPlanningVolunteers],
    },
  ],
  imports: [PrismaModule],
  exports: [MultiPlanningService],
})
export class MultiPlanningModule {}
