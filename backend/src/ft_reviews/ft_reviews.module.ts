import { Module } from '@nestjs/common';
import { FtService } from 'src/ft/ft.service';
import { FtUserRequestService } from 'src/ft_user_request/ft_user_request.service';
import { PrismaService } from '../prisma.service';
import { FtReviewsController } from './ft_reviews.controller';
import { FtReviewsService } from './ft_reviews.service';

@Module({
  controllers: [FtReviewsController],
  providers: [FtReviewsService, PrismaService, FtService, FtUserRequestService],
})
export class FtReviewsModule {}
