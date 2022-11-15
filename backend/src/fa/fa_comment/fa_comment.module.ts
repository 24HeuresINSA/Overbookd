import { Module } from '@nestjs/common';
import { FaCommentController } from './fa_comment.controller';
import { PrismaService } from '../../prisma.service';
import { FaCommentService } from './fa_comment.service';

@Module({
  controllers: [FaCommentController],
  providers: [FaCommentService, PrismaService],
})
export class FA_commentModule {}
