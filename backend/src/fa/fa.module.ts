import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [FaController],
  providers: [FaService, PrismaService],
})
export class FaModule {}
