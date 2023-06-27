import { ApiProperty } from '@nestjs/swagger';
import { SignaType } from '../faSignaNeedTypes';

export class FaSignaNeedsExportCsvDto {
  @ApiProperty({
    description: 'Name of the FA',
    type: String,
  })
  faName: string;

  @ApiProperty({
    description: 'Type of the signa',
    enum: SignaType,
  })
  signaType: SignaType;

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
