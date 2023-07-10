import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtUserRequestController } from './ftUserRequest.controller';
import { FtUserRequestService } from './ftUserRequest.service';

@Module({
  controllers: [FtUserRequestController],
  providers: [FtUserRequestService, PrismaService],
})
export class FtUserRequestModule {}
