import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FtUserRequestDto {
  @ApiProperty({
    description: 'The id of the time window',
    example: 1,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  ftTimeWindowsId: number;

  @ApiProperty({
    description: 'The id of the user requested on the time window',
    example: 1,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  userId: number;
}
