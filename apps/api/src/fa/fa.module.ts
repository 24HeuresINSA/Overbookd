import { Module } from '@nestjs/common';
import { FaService } from './fa.service';
import { FaController } from './fa.controller';
import { PrismaService } from '../prisma.service';
import { CommonModule } from '../common/common.module';
import { GearRequestsModule } from '../gear-requests/gearRequests.module';

@Module({
  imports: [CommonModule, GearRequestsModule],
  controllers: [FaController],
  providers: [FaService, PrismaService],
})
export class FaModule {}
