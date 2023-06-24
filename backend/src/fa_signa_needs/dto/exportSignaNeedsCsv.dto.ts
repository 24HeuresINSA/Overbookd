import { ApiProperty } from '@nestjs/swagger';
import { SignaType } from '@prisma/client';

export class FaSignaNeedsExportCsvDto {
  @ApiProperty({
    description: 'Name of the FA',
    type: String,
  })
  fa_name: string;

  @ApiProperty({
    description: 'Type of the signa',
    enum: SignaType,
  })
  signa_type: SignaType;

  @ApiProperty({
    description: 'Text of the signa',
    type: String,
  })
  text: string;

  @ApiProperty({
    description: 'Count of needed signa',
    type: Number,
  })
  count: number;

  @ApiProperty({
    description: 'Comment',
    type: String,
  })
  comment?: string;
}
