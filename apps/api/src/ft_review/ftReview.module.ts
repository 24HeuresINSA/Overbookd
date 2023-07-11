import { Module } from '@nestjs/common';
import { CommonModule } from '../../src/common/common.module';
import { FtService } from '../../src/ft/ft.service';
import { PrismaService } from '../prisma.service';
import { FtReviewController } from './ftReview.controller';
import { FtReviewService } from './ftReview.service';
import { FtUserRequestService } from '../../src/ft_user_request/ftUserRequest.service';

@Module({
  imports: [CommonModule],
  controllers: [FtReviewController],
  providers: [FtReviewService, PrismaService, FtService, FtUserRequestService],
})
export class FtReviewModule {}
