import {
  APPROVED,
  Adherent,
  CREATED,
  FestivalActivityKeyEvent as KeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-event";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "../../../common/dto/adherent.response.dto";

export class KeyEventResponseDto implements KeyEvent {
  @ApiProperty({ enum: [CREATED, READY_TO_REVIEW, APPROVED, REJECTED] })
  action: KeyEvent["action"];

  @ApiProperty({ type: AdherentResponseDto })
  by: Adherent;

  @ApiProperty({})
  at: Date;

  @ApiProperty({})
  description: string;
}
