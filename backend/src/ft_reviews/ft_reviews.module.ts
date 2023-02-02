import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtReviewsController } from './ft_reviews.controller';
import { FtReviewsService } from './ft_reviews.service';

@Module({
  controllers: [FtReviewsController],
  providers: [FtReviewsService, PrismaService],
})
export class FtReviewsModule {}
