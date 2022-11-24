import { Module } from '@nestjs/common';
import { FaElectricityNeedsService } from './fa_electricity_needs.service';
import { FaElectricityNeedsController } from './fa_electricity_needs.controller';

@Module({
  controllers: [FaElectricityNeedsController],
  providers: [FaElectricityNeedsService]
})
export class FaElectricityNeedsModule {}
