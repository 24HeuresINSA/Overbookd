import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtTimeWindowsController } from './ft_time_windows.controller';
import { FtTimeWindowsService } from './ft_time_windows.service';

@Module({
  controllers: [FtTimeWindowsController],
  providers: [FtTimeWindowsService, PrismaService],
})
export class FtTimeWindowsModule {}
