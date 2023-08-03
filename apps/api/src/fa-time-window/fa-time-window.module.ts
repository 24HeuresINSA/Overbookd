import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaTimeWindowController } from './fa-time-window.controller';
import { FaTimeWindowService } from './fa-time-window.service';

@Module({
  controllers: [FaTimeWindowController],
  providers: [FaTimeWindowService, PrismaService],
})
export class FaTimeWindowModule {}
