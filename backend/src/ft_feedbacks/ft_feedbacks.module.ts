import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtFeedbacksController } from './ft_feedbacks.controller';
import { FtFeedbacksService } from './ft_feedbacks.service';

@Module({
  controllers: [FtFeedbacksController],
  providers: [FtFeedbacksService, PrismaService],
})
export class FtFeedbacksModule {}
