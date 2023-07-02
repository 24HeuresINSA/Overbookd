import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FaSignaNeedController } from './faSignaNeed.controller';
import { FaSignaNeedService } from './faSignaNeed.service';

@Module({
  controllers: [FaSignaNeedController],
  providers: [FaSignaNeedService, PrismaService],
})
export class FaSignaNeedModule {}
