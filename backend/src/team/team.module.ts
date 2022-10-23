import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [],
  controllers: [TeamController],
  providers: [TeamService, PrismaService, UserService],
})
export class TeamModule {}
