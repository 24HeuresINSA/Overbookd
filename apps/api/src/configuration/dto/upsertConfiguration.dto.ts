import { ApiProperty } from '@nestjs/swagger';
import { ConfigurationValueRepresentation } from '../configuration.model';
import { IsNotEmpty, IsObject } from 'class-validator';
import { Prisma } from '@prisma/client';

export class UpsertConfigurationDto
  implements ConfigurationValueRepresentation
{
  @ApiProperty({
    required: true,
    description: 'Contains Json config object, with arbitrary value',
  })
  @IsObject()
  @IsNotEmpty()
  value: Prisma.JsonValue;
}
