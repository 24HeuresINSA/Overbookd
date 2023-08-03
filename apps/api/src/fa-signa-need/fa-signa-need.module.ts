import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSignaNeedController } from './fa-signa-need.controller';
import { FaSignaNeedService } from './fa-signa-need.service';

@Module({
  controllers: [FaSignaNeedController],
  providers: [FaSignaNeedService, PrismaService],
})
export class FaSignaNeedModule {}
