import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { FtService } from '../ft/ft.service';
import { PrismaService } from '../prisma.service';
import { FtReviewController } from './ft-review.controller';
import { FtReviewService } from './ft-review.service';
import { FtUserRequestService } from '../ft-user-request/ft-user-request.service';

@Module({
  imports: [CommonModule],
  controllers: [FtReviewController],
  providers: [FtReviewService, PrismaService, FtService, FtUserRequestService],
})
export class FtReviewModule {}
