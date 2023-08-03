import { Module } from '@nestjs/common';
import { CommonModule } from '../../src/common/common.module';
import { FtUserRequestService } from '../ft-user-request/ft-user-request.service';
import { GearRequestModule } from '../gear-request/gear-request.module';
import { PrismaService } from '../prisma.service';
import { FtController } from './ft.controller';
import { FtService } from './ft.service';

@Module({
  imports: [CommonModule, GearRequestModule],
  controllers: [FtController],
  providers: [FtService, PrismaService, FtUserRequestService],
})
export class FtModule {}
