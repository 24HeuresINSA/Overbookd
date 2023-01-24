import { Module } from '@nestjs/common';
import { PrismaGearRepository } from 'src/catalog/repositories';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma.service';
import { GearRequestsController } from './gearRequests.controller';
import { GearRequestsService } from './gearRequests.service';
import { PrismaAnimationRepository } from './repositories/animation.repository.prisma';
import { PrismaGearRequestRepository } from './repositories/gearRequest.repository.prisma';
import { PrismaPeriodRepository } from './repositories/period.repository.prisma';

@Module({
  imports: [CommonModule],
  controllers: [GearRequestsController],
  providers: [
    PrismaService,
    GearRequestsService,
    { provide: 'GEAR_REPOSITORY', useClass: PrismaGearRepository },
    {
      provide: 'GEAR_REQUEST_REPOSITORY',
      useClass: PrismaGearRequestRepository,
    },
    {
      provide: 'ANIMATION_REPOSITORY',
      useClass: PrismaAnimationRepository,
    },
    {
      provide: 'PERIOD_REPOSITORY',
      useClass: PrismaPeriodRepository,
    },
  ],
  exports: [GearRequestsService],
})
export class GearRequestsModule {}
