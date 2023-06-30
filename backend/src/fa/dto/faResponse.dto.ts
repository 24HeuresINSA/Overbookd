import { ApiProperty } from '@nestjs/swagger';

export class CompleteFaResponseDto {
  @ApiProperty({
    required: true,
    description: 'The id of the ft',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The name of the ft',
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: 'The description of the ft',
    type: String,
  })
  description: string;
}
