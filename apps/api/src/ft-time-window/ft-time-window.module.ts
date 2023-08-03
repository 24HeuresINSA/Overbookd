import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtTimeWindowService } from './ft-time-window.service';
import { FtTimeWindowController } from './ft-time-window.controller';

@Module({
  controllers: [FtTimeWindowController],
  providers: [FtTimeWindowService, PrismaService],
})
export class FtTimeWindowModule {}
