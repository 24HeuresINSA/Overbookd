import { ApiProperty } from '@nestjs/swagger';
import { signa_type } from '@prisma/client';

export class FaSignaNeedsExportCsvDto {
  @ApiProperty({
    description: 'Name of the FA',
    type: String,
  })
  fa_name: string;

  @ApiProperty({
    description: 'Type of the signa',
    enum: signa_type,
  })
  signa_type: signa_type;

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
