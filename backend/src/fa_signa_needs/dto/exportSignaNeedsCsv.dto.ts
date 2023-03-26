import { ApiProperty } from '@nestjs/swagger';
import { signa_type } from '@prisma/client';

export class FaSignaNeedsExportCsvDto {
  @ApiProperty({})
  fa_name: string;
  signa_type: signa_type;
  text: string;
  count: number;
  comment?: string;
}
