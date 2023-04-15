import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import { Period } from 'src/volunteer-availability/domain/period.model';

export class OrgaNeedsRequestDto implements Period {
  @ApiProperty({
    name: 'start',
    description: 'The start of the period',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  start: Date;

  @ApiProperty({
    name: 'end',
    description: 'The end of the period',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  end: Date;
}
