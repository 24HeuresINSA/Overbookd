import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { FtFeedbackController } from './ftFeedback.controller';
import { FtFeedbackService } from './ftFeedback.service';

@Module({
  controllers: [FtFeedbackController],
  providers: [FtFeedbackService, PrismaService],
})
export class FtFeedbackModule {}
