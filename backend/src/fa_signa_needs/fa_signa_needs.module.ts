import { Module } from '@nestjs/common';
import { FaSignaNeedsService } from './fa_signa_needs.service';
import { FaSignaNeedsController } from './fa_signa_needs.controller';

@Module({
  controllers: [FaSignaNeedsController],
  providers: [FaSignaNeedsService]
})
export class FaSignaNeedsModule {}
