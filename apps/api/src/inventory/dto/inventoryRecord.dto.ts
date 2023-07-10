import { ApiProperty } from '@nestjs/swagger';
import { Gear } from 'src/catalog/interfaces';
import { GearRepresentation } from 'src/common/dto/gearRepresentation.dto';
import { InventoryRecord } from '../inventory.service';

export class InventoryRecordDto implements InventoryRecord {
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
    description: 'Gear storage location',
    type: String,
  })
  storage: string;
}
