import { ApiProperty } from "@nestjs/swagger";
import { CatalogGear, InventoryRecord } from "@overbookd/http";
import { CatalogGearResponseDto } from "../../common/dto/catalog-gear.response.dto";

export class InventoryRecordDto implements InventoryRecord {
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
    description: "Gear storage location",
    type: String,
  })
  storage: string;
}
