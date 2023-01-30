import { Module } from '@nestjs/common';
import { SlugifyService } from 'src/common/services/slugify.service';
import { PermissionService } from 'src/permission/permission.service';
import { TeamService } from 'src/team/team.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from '../prisma.service';
import { FtReviewsController } from './ft_reviews.controller';
import { FtReviewsService } from './ft_reviews.service';

@Module({
  controllers: [FtReviewsController],
  providers: [
    FtReviewsService,
    PrismaService,
    PermissionService,
    TeamService,
    UserService,
    SlugifyService,
  ],
})
export class FtReviewsModule {}
