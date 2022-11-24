import { PartialType } from '@nestjs/swagger';
import { CreateFaCommentDto } from './create-fa_comment.dto';

export class UpdateFaCommentDto extends PartialType(CreateFaCommentDto) {}
