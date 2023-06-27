import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { FtService } from 'src/ft/ft.service';
import { FtUserRequestService } from 'src/ft_user_request/ft_user_request.service';
import { PrismaService } from '../prisma.service';
import { FtReviewsController } from './ft_reviews.controller';
import { FtReviewsService } from './ft_reviews.service';

@Module({
  imports: [CommonModule],
  controllers: [FtReviewsController],
  providers: [FtReviewsService, PrismaService, FtService, FtUserRequestService],
})
export class FtReviewsModule {}
