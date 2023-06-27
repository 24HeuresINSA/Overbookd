import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtUserRequestController } from './ft_user_request.controller';
import { FtUserRequestService } from './ft_user_request.service';

@Module({
  controllers: [FtUserRequestController],
  providers: [FtUserRequestService, PrismaService],
})
export class FtUserRequestModule {}
