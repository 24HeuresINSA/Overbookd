import { ApiProperty } from "@nestjs/swagger";
import {
  CatalogGear,
  InventoryGroupedRecord,
  LiteInventoryRecord,
} from "@overbookd/http";
import { CatalogGearResponseDto } from "../../common/dto/catalog-gear.response.dto";

class LiteInventoryRecordDto implements LiteInventoryRecord {
  @ApiProperty()
  quantity: number;

  @ApiProperty()
  storage: string;
}

export class InventoryGroupedRecordResponseDto
  implements InventoryGroupedRecord
{
  @ApiProperty({
    required: true,
    description: "Gear quantity",
    type: Number,
  })
  quantity: number;

  @ApiProperty({
    required: true,
    description: "Gear",
    type: CatalogGearResponseDto,
  })
  gear: CatalogGear;

  @ApiProperty({
    required: true,
    description: "All records for the gear",
    isArray: true,
    type: LiteInventoryRecordDto,
  })
  records: LiteInventoryRecord[];
}
