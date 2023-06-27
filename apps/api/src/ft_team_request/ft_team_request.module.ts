import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FtTeamRequestController } from './ft_team_request.controller';
import { FtTeamRequestService } from './ft_team_request.service';

@Module({
  controllers: [FtTeamRequestController],
  providers: [FtTeamRequestService, PrismaService],
})
export class FtTeamRequestModule {}
