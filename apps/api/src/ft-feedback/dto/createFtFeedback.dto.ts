import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString } from 'class-validator';
import { FtFeedbackSubjectType } from '../ftFeedback.model';

export class CreateFtFeedbackDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'The author id of feedback',
  })
  @IsNumber()
  authorId: number;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'The date of feedback creation',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The subject of feedback',
  })
  @IsString()
  subject: FtFeedbackSubjectType;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The comment of feedback',
  })
  @IsString()
  comment: string;
}
