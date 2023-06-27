import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtFeedbackController } from './ft_feedback.controller';
import { FtFeedbackService } from './ft_feedback.service';

@Module({
  controllers: [FtFeedbackController],
  providers: [FtFeedbackService, PrismaService],
})
export class FtFeedbackModule {}
