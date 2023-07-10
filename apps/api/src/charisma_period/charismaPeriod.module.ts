import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CharismaPeriodController } from './charismaPeriod.controller';
import { CharismaPeriodService } from './charismaPeriod.service';

@Module({
  controllers: [CharismaPeriodController],
  providers: [CharismaPeriodService, PrismaService],
})
export class CharismaPeriodModule {}
