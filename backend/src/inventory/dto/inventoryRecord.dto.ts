import { ApiProperty } from '@nestjs/swagger';
import { InventoryRecord } from '../inventory.service';
import { InventoryGroupedRecordResponseDto } from './inventoryGroupedRecordResponse.dto';

export class InventoryRecordDto
  extends InventoryGroupedRecordResponseDto
  implements InventoryRecord
{
  @ApiProperty({
    required: true,
    description: 'Gear storage location',
    type: String,
  })
  storage: string;
}
