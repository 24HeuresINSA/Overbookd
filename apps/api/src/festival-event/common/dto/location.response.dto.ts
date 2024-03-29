import { ApiProperty } from "@nestjs/swagger";
import { Location } from "@overbookd/festival-event";

export class LocationResponseDto implements Location {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  name: string;
}
