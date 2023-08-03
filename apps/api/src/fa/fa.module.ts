import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';
import { CommonModule } from '../common/common.module';
import { GearRequestModule } from '../gear-request/gear-request.module';

@Module({
  imports: [CommonModule, GearRequestModule],
  controllers: [FaController],
  providers: [FaService, PrismaService],
})
export class FaModule {}
