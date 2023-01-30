import { ApiProperty } from '@nestjs/swagger';
import { FtFeedbacks, FtSubjectType } from '@prisma/client';
import { IsDateString, IsNumber, IsString } from 'class-validator';

class UserName {
  firstname: string;
  lastname: string;
}

class UserNameWithId extends UserName {
  id: number;
}

export class FtFeedbacksResponseDto implements FtFeedbacks {
  @ApiProperty({
    required: true,
    description: 'The id of the ft feedback',
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    required: true,
    description: 'The ft id of the ft feedback',
    type: Number,
  })
  @IsNumber()
  ftId: number;

  // TODO: A remplacer par un objet UserNameWithId
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
