import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FtTeamRequestController } from './ftTeamRequest.controller';
import { FtTeamRequestService } from './ftTeamRequest.service';

@Module({
  controllers: [FtTeamRequestController],
  providers: [FtTeamRequestService, PrismaService],
})
export class FtTeamRequestModule {}
