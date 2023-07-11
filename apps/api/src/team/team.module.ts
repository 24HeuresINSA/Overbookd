import { Module } from '@nestjs/common';
import { CommonModule } from '../../src/common/common.module';
import { MailService } from '../../src/mail/mail.service';
import { UserService } from '../../src/user/user.service';
import { PrismaService } from '../prisma.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [CommonModule],
  controllers: [TeamController],
  providers: [PrismaService, UserService, TeamService, MailService],
})
export class TeamModule {}
