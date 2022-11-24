import { Module } from '@nestjs/common';
import { FaCommentService } from './fa_comment.service';
import { FaCommentController } from './fa_comment.controller';

@Module({
  controllers: [FaCommentController],
  providers: [FaCommentService],
})
export class FaCommentModule {}
