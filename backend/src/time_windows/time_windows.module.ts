import { Module } from '@nestjs/common';
import { TimeWindowsService } from './time_windows.service';
import { TimeWindowsController } from './time_windows.controller';

@Module({
  controllers: [TimeWindowsController],
  providers: [TimeWindowsService],
})
export class TimeWindowsModule {}
