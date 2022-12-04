import { Module } from '@nestjs/common';
import { FaSignaNeedsService } from './fa_signa_needs.service';
import { FaSignaNeedsController } from './fa_signa_needs.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FaSignaNeedsController],
  providers: [FaSignaNeedsService, PrismaService],
})
export class FaSignaNeedsModule {}
