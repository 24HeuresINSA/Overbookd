import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';
import { CommonModule } from 'src/common/common.module';
import { GearRequestsModule } from 'src/gear-requests/gearRequests.module';
import { CommonModule } from 'src/common/common.module';
import { PrismaGearRepository } from 'src/catalog/repositories';
import { GearRequestsService } from './gear-requests/gearRequests.service';
import { PrismaPeriodRepository } from './gear-requests/repositories/period.repository.prisma';
import { PrismaAnimationRepository } from './gear-requests/repositories/animation.repository.prisma';
import { PrismaGearRequestRepository } from './gear-requests/repositories/gearRequest.repository.prisma';

@Module({
  imports: [CommonModule, GearRequestsModule],
  controllers: [FaController],
  providers: [FaService, PrismaService],
})
export class FaModule {}
