import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtFeedbackController } from './ft-feedback.controller';
import { FtFeedbackService } from './ft-feedback.service';

@Module({
  controllers: [FtFeedbackController],
  providers: [FtFeedbackService, PrismaService],
})
export class FtFeedbackModule {}
