import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaPeriodController } from './charisma_period.controller';
import { CharismaPeriodService } from './charisma_period.service';

@Module({
  controllers: [CharismaPeriodController],
  providers: [CharismaPeriodService, PrismaService],
})
export class CharismaPeriodModule {}
