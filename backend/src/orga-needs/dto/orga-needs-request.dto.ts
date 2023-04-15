import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, ValidationArguments } from 'class-validator';

export class OrgaNeedsRequestDto {
  @ApiProperty({
    name: 'selectedDay',
    description: 'The day to get the needs for',
    type: String,
  })
  @IsString()
  @Matches(new RegExp(/^\d{4}-\d{2}-\d{2}$/), {
    message: (va: ValidationArguments) =>
      `${va.property} should be in the format YYYY-MM-DD`,
  })
  selectedDay: string;
}
