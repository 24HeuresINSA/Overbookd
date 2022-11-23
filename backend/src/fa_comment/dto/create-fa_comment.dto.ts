import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export enum subject_type {
  REFUSED = 'REFUSED',
  VALIDATED = 'VALIDATED',
  COMMENT = 'COMMENT',
}
export class CreateFaCommentDto {
  @ApiProperty({
    required: true,
    description: 'The text of the comment',
  })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    required: true,
    description: 'The subject of the comment',
  })
  subject: subject_type;

  @ApiProperty({
    required: true,
    description: 'The author of the comment',
  })
  @IsNumber()
  author: number;

  @ApiProperty({
    required: false,
    description: 'The creation date of the comment',
    default: new Date(),
  })
  @IsOptional()
  created_at?: Date;

  @ApiProperty({
    required: true,
    description: 'The id of the author team',
  })
  @IsNumber()
  team_id: number;
}
