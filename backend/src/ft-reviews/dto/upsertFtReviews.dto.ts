import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class UpsertFtReviewsDto {
  @ApiProperty({
    required: true,
    type: Number,
    description: 'The id of the reviewer',
  })
  @IsNumber()
  @Min(1)
  userId?: number;
}
