import { ApiProperty } from '@nestjs/swagger';
import { SignaType, signaType } from '../faSignaNeed.model';

export class FaSignaNeedsExportCsvDto {
  @ApiProperty({
    description: 'Name of the FA',
    type: String,
  })
  faName: string;

  @ApiProperty({
    description: 'Type of the signa',
    enum: signaType,
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
