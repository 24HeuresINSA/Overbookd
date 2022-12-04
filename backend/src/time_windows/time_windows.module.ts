import { Module } from '@nestjs/common';
import { TimeWindowsService } from './time_windows.service';
import { TimeWindowsController } from './time_windows.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [TimeWindowsController],
  providers: [TimeWindowsService, PrismaService],
})
export class TimeWindowsModule {}
