import { ApiProperty } from '@nestjs/swagger';
import { FtFeedback, FtSubjectType } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

class Author {
  firstname: string;
  lastname: string;
}

export class FtFeedbackResponseDto
  implements Omit<FtFeedback, 'authorId' | 'ftId'>
{
  @ApiProperty({
    required: true,
    description: 'The id of the ft feedback',
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    type: Author,
    description: 'The author of feedback',
  })
  @IsNumber()
  author: Author;

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
