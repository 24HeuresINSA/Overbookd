import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FaElectricityNeedController } from './faElectricityNeed.controller';
import { FaElectricityNeedService } from './faElectricityNeed.service';

@Module({
  controllers: [FaElectricityNeedController],
  providers: [FaElectricityNeedService, PrismaService],
})
export class FaElectricityNeedModule {}
