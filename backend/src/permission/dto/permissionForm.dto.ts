import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, ValidationArguments } from 'class-validator';

export class PermissionFormDto {
  @ApiProperty({
    name: 'name',
    required: true,
    description: 'The name of the permission',
    type: String,
  })
  @IsString()
  @Matches(new RegExp(/[a-z|-]+/), {
    message: (va: ValidationArguments) => `${va.property} should be kebab-case`,
  })
  name: string;
}
