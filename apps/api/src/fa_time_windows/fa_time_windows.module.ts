import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FaTimeWindowsController } from './fa_time_windows.controller';
import { FaTimeWindowsService } from './fa_time_windows.service';

@Module({
  controllers: [FaTimeWindowsController],
  providers: [FaTimeWindowsService, PrismaService],
})
export class FaTimeWindowsModule {}
