import { ApiProperty } from '@nestjs/swagger';
import { Gear } from 'src/catalog/interfaces';
import { GearRepresentation } from 'src/common/dto/gearRepresentation.dto';
import { GroupedRecord } from '../inventory.service';

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
}
