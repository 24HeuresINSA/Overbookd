import { ApiProperty } from '@nestjs/swagger';
import { Gear } from 'src/catalog/interfaces';
import { GearRepresentation } from 'src/common/dto/gearRepresentation.dto';
import { GroupedRecord, InventoryRecord } from '../inventory.service';
import { InventoryRecordDto } from './inventoryRecord.dto';

export class InventoryGroupedRecordResponseDto implements GroupedRecord {
  @ApiProperty({
    required: true,
    description: 'Gear quantity',
    type: Number,
  })
  quantity: number;
  @ApiProperty({
    required: true,
    description: 'Gear',
    type: GearRepresentation,
  })
  gear: Gear;
  @ApiProperty({
    required: true,
    description: 'All records for the gear',
    isArray: true,
    type: InventoryRecordDto,
  })
  records: InventoryRecord[];
}
