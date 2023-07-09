import { ApiProperty } from '@nestjs/swagger';
import { Gear } from 'src/catalog/interfaces';
import { GearRepresentation } from 'src/common/dto/gearRepresentation.dto';
import { GroupedRecord, LiteInventoryRecord } from '../inventory.service';

class LiteInventoryRecordRepresentation implements LiteInventoryRecord {
  quantity: number;
  storage: string;
}

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
    type: LiteInventoryRecordRepresentation,
  })
  records: LiteInventoryRecord[];
}
