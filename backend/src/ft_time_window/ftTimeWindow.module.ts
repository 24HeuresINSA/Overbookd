import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtTimeWindowService } from './ftTimeWindow.service';
import { FtTimeWindowController } from './ftTimeWindow.controller';

@Module({
  controllers: [FtTimeWindowController],
  providers: [FtTimeWindowService, PrismaService],
})
export class FtTimeWindowModule {}
