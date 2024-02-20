import { ApiProperty } from "@nestjs/swagger";
import { Mobilization, TimeWindow } from "@overbookd/festival-event";

type BaseMobilization = TimeWindow & Pick<Mobilization, "durationSplitInHour">;

export class BaseMobilizationResponseDto implements BaseMobilization {
  @ApiProperty({})
  id: string;

  @ApiProperty({})
  start: Date;

  @ApiProperty({})
  end: Date;

  @ApiProperty({})
  durationSplitInHour: number;
}
