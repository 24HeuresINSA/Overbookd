import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SignaLocationController } from './signa_location.controller';
import { SignaLocationService } from './signa_location.service';

@Module({
  controllers: [SignaLocationController],
  providers: [SignaLocationService, PrismaService],
})
export class SignaLocationModule {}
