import { ApiProperty } from '@nestjs/swagger';
import { FtSubjectType } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateFtFeedbacksDto {
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
  subject: FtSubjectType;

  @ApiProperty({
    required: true,
    type: String,
    description: 'The comment of feedback',
  })
  @IsString()
  comment: string;
}
