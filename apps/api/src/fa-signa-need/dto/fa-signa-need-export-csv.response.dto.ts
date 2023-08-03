import { ApiProperty } from '@nestjs/swagger';
import { SignaType, signaTypes } from '../fa-signa-need.model';

export class FaSignaNeedExportCsvResponseDto {
  @ApiProperty({
    description: 'Name of the FA',
    type: String,
  })
  faName: string;

  @ApiProperty({
    description: 'Type of the signa',
    enum: signaTypes,
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
