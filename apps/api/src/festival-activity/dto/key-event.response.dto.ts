import {
  APPROVED,
  Adherent,
  CREATED,
  KeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/festival-activity";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "./adherent.response.dto";

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
