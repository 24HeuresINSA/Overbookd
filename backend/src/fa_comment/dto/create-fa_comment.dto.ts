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

enum FaFeedbackSubjectType {
  REFUSED = 'REFUSED',
  VALIDATED = 'VALIDATED',
  COMMENT = 'COMMENT',
  SUBMIT = 'SUBMIT',
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
    enum: FaFeedbackSubjectType,
  })
  @IsDefined()
  @IsEnum(FaFeedbackSubjectType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(FaFeedbackSubjectType)}`,
  })
  subject: FaFeedbackSubjectType;

  @ApiProperty({
    required: true,
    description: 'The author of the comment',
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  authorId: number;

  @ApiProperty({
    required: false,
    description: 'The creation date of the comment',
    default: new Date(),
  })
  @IsOptional()
  @IsNotEmpty()
  @IsDateString()
  createdAt?: Date;
}
