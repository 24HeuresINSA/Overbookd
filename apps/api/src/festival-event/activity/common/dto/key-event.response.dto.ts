import {
  Adherent,
  FestivalActivityKeyEvent as KeyEvent,
} from "@overbookd/festival-event";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";
import {
  APPROVED,
  CREATED,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-event-constants";

export class KeyEventResponseDto implements KeyEvent {
  @ApiProperty({ enum: [CREATED, READY_TO_REVIEW, APPROVED, REJECTED] })
  action: KeyEvent["action"];

  @ApiProperty({ type: AdherentResponseDto })
  by: Adherent;

  @ApiProperty()
  at: Date;

  @ApiProperty()
  description: string;
}
