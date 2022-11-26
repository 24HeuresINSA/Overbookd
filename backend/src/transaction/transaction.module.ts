import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from '../prisma.service';
import { TeamService } from '../team/team.service';
import { PermissionService } from '../permission/permission.service';
import { UserService } from '../user/user.service';
import { SlugifyService } from 'src/common/services/slugify.service';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    PrismaService,
    UserService,
    TeamService,
    PermissionService,
    SlugifyService,
  ],
})
export class TransactionModule {}
