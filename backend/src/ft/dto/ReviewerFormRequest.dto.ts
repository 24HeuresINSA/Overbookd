import { ApiProperty } from '@nestjs/swagger';

export class ReviewerFormRequestDto {
  @ApiProperty({
    required: true,
    description: 'The id of the Reviewer',
    type: Number,
  })
  id: number;
}
