import { ApiProperty } from "@nestjs/swagger";
import { Signage } from "@overbookd/festival-activity";
import { signaTypes } from "./draft-festival-activity.response.dto";

export class SignageResponseDto implements Signage {
  @ApiProperty({})
  id: string;

  @ApiProperty({
    description: "Wanted quantity for this signage",
  })
  quantity: number;

  @ApiProperty({})
  text: string;

  @ApiProperty({})
  size: string;

  @ApiProperty({
    enum: signaTypes,
    example: "BACHE",
  })
  type: "BACHE" | "PANNEAU" | "AFFICHE";

  @ApiProperty({})
  comment: string;
}
