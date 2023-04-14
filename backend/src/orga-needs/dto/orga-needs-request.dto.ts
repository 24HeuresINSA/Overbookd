import { ApiProperty } from '@nestjs/swagger';

export class OrgaNeedsRequestDto {
  @ApiProperty({
    name: 'date',
    description: 'The date',
    type: Date,
  })
  date: Date;
}
