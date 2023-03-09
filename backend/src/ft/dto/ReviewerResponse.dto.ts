import { ApiProperty } from '@nestjs/swagger';

export class ReviewerResponseDto {
  @ApiProperty({
    required: true,
    description: 'The id of the Reviewer',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The firstname of the Reviewer',
    type: String,
  })
  firstname: string;

  @ApiProperty({
    required: true,
    description: 'The lastname of the Reviewer',
    type: String,
  })
  lastname: string;

  @ApiProperty({
    required: false,
    description: 'The nickname of the Reviewer',
    type: String,
  })
  nickname?: string;
}
