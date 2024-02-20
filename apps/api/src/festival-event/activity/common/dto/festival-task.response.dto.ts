import { ApiProperty } from "@nestjs/swagger";
import { FestivalTaskChild } from "@overbookd/festival-event";

export class FestivalTaskResponseDto implements FestivalTaskChild {
  @ApiProperty({ required: true })
  id: FestivalTaskChild["id"];

  @ApiProperty({ required: true })
  name: FestivalTaskChild["name"];

  @ApiProperty({ required: true })
  status: FestivalTaskChild["status"];
}
