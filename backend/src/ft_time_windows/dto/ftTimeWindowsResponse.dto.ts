import { ApiProperty } from '@nestjs/swagger';
import { FtTimeWindows } from '@prisma/client';

export class ftTimeWindowsResponseDto implements FtTimeWindows {
  @ApiProperty({
    required: true,
    description: 'The id of the ft time window',
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: 'The ft id of the ft time window',
    type: Number,
  })
  ftId: number;

  @ApiProperty({
    required: true,
    description: 'The start of the ft time window',
    type: Date,
  })
  start: Date;

  @ApiProperty({
    required: true,
    description: 'The end of the ft time window',
    type: Date,
  })
  end: Date;

  @ApiProperty({
    required: true,
    description: 'The slice time of the ft time window',
    type: Number,
  })
  sliceTime: number;
}
