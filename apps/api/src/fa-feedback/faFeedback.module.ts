import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FaFeedbackController } from './faFeedback.controller';
import { FaFeedbackService } from './faFeedback.service';

@Module({
  controllers: [FaFeedbackController],
  providers: [FaFeedbackService, PrismaService],
})
export class FaFeedbackModule {}
