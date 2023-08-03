import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma.service';
import { FaTimeWindowController } from './faTimeWindow.controller';
import { FaTimeWindowService } from './faTimeWindow.service';

@Module({
  controllers: [FaTimeWindowController],
  providers: [FaTimeWindowService, PrismaService],
})
export class FaTimeWindowModule {}
