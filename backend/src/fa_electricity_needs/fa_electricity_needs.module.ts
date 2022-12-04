import { Module } from '@nestjs/common';
import { FaElectricityNeedsService } from './fa_electricity_needs.service';
import { FaElectricityNeedsController } from './fa_electricity_needs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FaElectricityNeedsController],
  providers: [FaElectricityNeedsService, PrismaService],
})
export class FaElectricityNeedsModule {}
