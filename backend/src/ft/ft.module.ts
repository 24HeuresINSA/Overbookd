import { Module } from '@nestjs/common';
import { GearRequestsModule } from 'src/gear-requests/gearRequests.module';
import { PrismaService } from '../prisma.service';
import { FtController } from './ft.controller';
import { FtService } from './ft.service';

@Module({
  imports: [GearRequestsModule],
  controllers: [FtController],
  providers: [FtService, PrismaService],
})
export class FtModule {}
