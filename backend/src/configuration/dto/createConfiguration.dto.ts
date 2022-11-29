import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateConfigurationDto {
  @ApiProperty({
    required: true,
    description:
      'Configuration key, most of the time, correspond to page in the view',
  })
  @IsString()
  @IsNotEmpty()
  readonly key: string;

  @ApiProperty({
    required: true,
    description: 'Contains Json config object, with arbitrary value',
  })
  @IsObject()
  @IsNotEmpty()
  readonly value: Prisma.InputJsonObject;
}
