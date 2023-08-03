import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaElectricityNeedController } from './fa-electricity-need.controller';
import { FaElectricityNeedService } from './fa-electricity-need.service';

@Module({
  controllers: [FaElectricityNeedController],
  providers: [FaElectricityNeedService, PrismaService],
})
export class FaElectricityNeedModule {}
