import { Module } from '@nestjs/common';
import { FaCommentService } from './fa_comment.service';
import { FaCommentController } from './fa_comment.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [FaCommentController],
  providers: [FaCommentService, PrismaService],
})
export class FaCommentModule {}
