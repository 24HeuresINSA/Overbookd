import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PermissionFormDto {
  @ApiProperty({
    name: 'name',
    required: true,
    description: 'The name of the permission',
    type: String,
  })
  @IsString()
  name: string;
}
