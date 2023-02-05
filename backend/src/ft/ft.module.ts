import { Module } from '@nestjs/common';
import { FtUserRequestService } from 'src/ft_user_request/ft_user_request.service';
import { GearRequestsModule } from 'src/gear-requests/gearRequests.module';
import { PrismaService } from '../prisma.service';
import { FtController } from './ft.controller';
import { FtService } from './ft.service';

@Module({
  imports: [GearRequestsModule],
  controllers: [FtController],
  providers: [FtService, PrismaService, FtUserRequestService],
})
export class FtModule {}
