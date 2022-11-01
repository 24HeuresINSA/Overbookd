import { ApiProperty } from '@nestjs/swagger';

export class CreateConfigurationDto {
  @ApiProperty({
    required: true,
    description:
      'Configuration key, most of the time, correspond to page in the view',
  })
  key: string;
  @ApiProperty({
    required: true,
    description: 'Contains Json config object, with arbitrary value',
  })
  value: Record<string, unknown>;
}
