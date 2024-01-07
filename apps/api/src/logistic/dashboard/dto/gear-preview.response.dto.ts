import { ApiProperty } from "@nestjs/swagger";
import { GearPreview } from "@overbookd/http";

export class GearPreviewResponseDto implements GearPreview {
  @ApiProperty({
    required: true,
    description: "Gear id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "Gear name",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "Gear slug",
    type: String,
  })
  slug: string;

  @ApiProperty({
    required: true,
    description: "Gear consumable status",
  })
  isConsumable: boolean;

  @ApiProperty({
    required: true,
    description: "Minimum stock discrepancy",
  })
  stockDiscrepancy: number;
}
