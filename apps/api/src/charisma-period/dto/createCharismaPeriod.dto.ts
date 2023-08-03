import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharismaPeriodDto {
  @ApiProperty({
    required: true,
    description: 'The name of the Charisma Period',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The description of the Charisma Period',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'The charisma associated the Charisma Period',
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  charisma: number;

  @ApiProperty({
    required: true,
    description: 'The start date of the Charisma Period',
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Charisma Period',
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  end: Date;
}
