import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class CreateSecurityPassDto {
  @ApiProperty({
    required: true,
    description: 'is the a pass needed',
  })
  @IsBoolean()
  is_needed: boolean;

  @ApiProperty({
    required: false,
    description: 'the security pass description',
  })
  @IsOptional()
  number_of_pass: number;
}
