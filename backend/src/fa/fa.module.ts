import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaGearRepository } from 'src/catalog/repositories';
import { GearRequestsService } from './gear-requests/gearRequests.service';
import { PrismaPeriodRepository } from './gear-requests/repositories/period.repository.prisma';
import { PrismaAnimationRepository } from './gear-requests/repositories/animation.repository.prisma';
import { PrismaGearRequestRepository } from './gear-requests/repositories/gearRequest.repository.prisma';

@Module({
  imports: [CommonModule],
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
