import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharismaGroupDto {
  @ApiProperty({
    required: true,
    description: 'The name of the Charisma Group',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The description of the Charisma Group',
    type: String,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    required: true,
    description: 'The charisma associated the Charisma Group',
    type: Number,
  })
  @IsDefined()
  @IsNumber()
  charisma: number;

  @ApiProperty({
    required: true,
    description: 'The start date of the Charisma Group',
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end date of the Charisma Group',
    type: Date,
  })
  @IsNotEmpty()
  @IsDateString()
  end: Date;
}
