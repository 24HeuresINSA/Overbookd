import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma.service';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [TeamController],
  providers: [TeamService, PrismaService, UserService],
})
export class TeamModule {}
