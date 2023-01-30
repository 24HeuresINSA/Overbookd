import { ApiProperty } from '@nestjs/swagger';
import { FtFeedbacks, FtSubjectType } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

class UserName {
  firstname: string;
  lastname: string;
}

export class FtFeedbacksResponseDto
  implements Omit<FtFeedbacks, 'authorId' | 'ftId'>
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
    type: UserName,
    description: 'The author of feedback',
  })
  @IsNumber()
  author: UserName;

  @ApiProperty({
    required: true,
    type: Date,
    description: 'The date of feedback creation',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    required: true,
    type: FtSubjectType,
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
