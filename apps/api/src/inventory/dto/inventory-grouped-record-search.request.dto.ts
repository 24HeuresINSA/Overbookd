import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { GroupedRecordSearch } from "../inventory.service";

export class InventoryGroupedRecordSearchRequestDto
  implements GroupedRecordSearch
{
  @ApiProperty({
    required: false,
    description: "Gear name",
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;
}
