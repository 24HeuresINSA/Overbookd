import { ApiProperty } from "@nestjs/swagger";
import { PrepareSupplyUpdate } from "@overbookd/festival-event";
import { IsString, ValidateIf } from "class-validator";

export class SupplyRequestDto implements PrepareSupplyUpdate {
  @ApiProperty({
    description: "Festival activity water supply",
    required: true,
  })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  water: string | null;
}
