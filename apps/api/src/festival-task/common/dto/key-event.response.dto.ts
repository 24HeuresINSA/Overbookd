import {
  CREATED,
  FestivalTaskKeyEvent as KeyEvent,
} from "@overbookd/festival-event";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "./adherent.response.dto";

export class KeyEventResponseDto implements KeyEvent {
  @ApiProperty({ enum: [CREATED] })
  action: KeyEvent["action"];

  @ApiProperty({ type: AdherentResponseDto })
  by: KeyEvent["by"];

  @ApiProperty({})
  at: KeyEvent["at"];

  @ApiProperty({})
  description: KeyEvent["description"];
}
