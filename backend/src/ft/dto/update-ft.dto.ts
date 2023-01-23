import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateFtDto {
  @ApiProperty({
    required: true,
    description: 'The name of the ft',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: 'The id of the parent fa',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  parentFaId?: number;

  @ApiProperty({
    required: false,
    description: 'Is the activity static',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isStatic?: boolean;

  @ApiProperty({
    required: false,
    description: 'The description of the ft',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: 'The id of the user whos responsible of the ft',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  userInChargeId?: number;

  @ApiProperty({
    required: false,
    description: 'The code of the team whos responsible of the ft',
  })
  @IsOptional()
  @IsString()
  teamCode?: string;

  @ApiProperty({
    required: false,
    description: 'The id of the location of the ft',
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  locationId?: number;

  @ApiProperty({
    required: false,
    description: 'The deleted status of the ft',
  })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
