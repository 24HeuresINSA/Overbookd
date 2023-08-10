import { ApiProperty } from '@nestjs/swagger';
import { IProvidePeriod } from '@overbookd/period';
import { Type } from 'class-transformer';
import { IsDate, IsDefined } from 'class-validator';

export class PeriodDto implements IProvidePeriod {
  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'Start date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  start: Date;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'End date of the period',
    required: true,
    type: Date,
  })
  @IsDefined()
  @Type(() => Date)
  @IsDate()
  end: Date;
}
