import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';
import { OrgaNeedsRequest } from '../orga-needs.service';

export class OrgaNeedsRequestDto implements OrgaNeedsRequest {
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

  @ApiProperty({
    name: 'teams',
    description: 'The teams you want to see the needs for',
    isArray: true,
    type: String,
  })
  @IsArray()
  @IsString({ each: true })
  teams: string[];
}
