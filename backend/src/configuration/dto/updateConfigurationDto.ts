import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsObject } from 'class-validator';

export class UpdateConfigurationDto {
  @ApiProperty({
    required: true,
    description: 'Contains Json config object, with arbitrary value',
  })
  @IsObject()
  @IsNotEmpty()
  value: Prisma.InputJsonObject;
}
