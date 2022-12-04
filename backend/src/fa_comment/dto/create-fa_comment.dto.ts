import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  ValidationArguments,
  IsDefined,
  Min,
  IsDateString,
} from 'class-validator';

enum subject_type {
  REFUSED = 'REFUSED',
  VALIDATED = 'VALIDATED',
  COMMENT = 'COMMENT',
}
export class CreateFaCommentDto {
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The text of the comment',
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    required: true,
    description: 'The subject of the comment',
    enum: subject_type,
  })
  @IsDefined()
  @IsEnum(subject_type, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(subject_type)}`,
  })
  subject: subject_type;

  @ApiProperty({
    required: true,
    description: 'The author of the comment',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  author: number;

  @ApiProperty({
    required: false,
    description: 'The creation date of the comment',
    default: new Date(),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  created_at?: Date;
}
