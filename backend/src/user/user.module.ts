import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { PermissionService } from 'src/permission/permission.service';
import { TeamService } from 'src/team/team.service';
import { SlugifyService } from 'src/common/services/slugify.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
    PermissionService,
    TeamService,
    SlugifyService,
  ],
})
export class UserModule {}
