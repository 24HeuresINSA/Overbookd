import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtController } from './ft.controller';
import { FtService } from './ft.service';

@Module({
  controllers: [FtController],
  providers: [FtService, PrismaService],
})
export class FtModule {}
