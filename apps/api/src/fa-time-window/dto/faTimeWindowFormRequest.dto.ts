import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
  IsDefined,
} from 'class-validator';
import { FaTimeWindowWithOptionalIdRepresentation } from '../faTimeWindow.model';

export class FaTimeWindowFormRequestDto
  implements FaTimeWindowWithOptionalIdRepresentation
{
  @ApiProperty({
    required: false,
    description: 'The id of the need',
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: 'The start of the time window',
  })
  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the time window',
  })
  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  end: Date;
}
