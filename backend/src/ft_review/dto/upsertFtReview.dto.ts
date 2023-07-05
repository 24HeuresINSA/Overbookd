import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpsertFtReviewDto {
  @ApiProperty({
    required: true,
    type: String,
    description: 'The team code of the reviewer',
  })
  @IsString()
  teamCode: string;
}
