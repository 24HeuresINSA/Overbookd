import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';
import { GearRequestsService } from './gear-requests/gearRequests.service';
import { PrismaGearRepository } from 'src/catalog/repositories';
import { PrismaAnimationRepository } from './gear-requests/repositories/animation.repository.prisma';
import { PrismaGearRequestRepository } from './gear-requests/repositories/gearRequest.repository.prisma';
import { PrismaPeriodRepository } from './gear-requests/repositories/period.repository.prisma';

@Module({
  controllers: [FaController],
  providers: [
    FaService,
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
})
export class FaModule {}
