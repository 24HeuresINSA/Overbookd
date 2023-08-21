import { Module } from "@nestjs/common";
import { PrismaGearRepository } from "../catalog/repositories";
import { CommonModule } from "../common/common.module";
import { PrismaService } from "../prisma.service";
import { GearRequestController } from "./gear-request.controller";
import { GearRequestService } from "./gear-request.service";
import { PrismaAnimationRepository } from "./repositories/animation.repository.prisma";
import { PrismaGearRequestRepository } from "./repositories/gear-request.repository.prisma";
import { PrismaPeriodRepository } from "./repositories/period.repository.prisma";
import { PrismaTaskRepository } from "./repositories/task.repository.prisma";

@Module({
  imports: [CommonModule],
  controllers: [GearRequestController],
  providers: [
    PrismaService,
    GearRequestService,
    { provide: "GEAR_REPOSITORY", useClass: PrismaGearRepository },
    {
      provide: "GEAR_REQUEST_REPOSITORY",
      useClass: PrismaGearRequestRepository,
    },
    {
      provide: "ANIMATION_REPOSITORY",
      useClass: PrismaAnimationRepository,
    },
    {
      provide: "PERIOD_REPOSITORY",
      useClass: PrismaPeriodRepository,
    },
    {
      provide: "TASK_REPOSITORY",
      useClass: PrismaTaskRepository,
    },
  ],
  exports: [GearRequestService],
})
export class GearRequestModule {}
