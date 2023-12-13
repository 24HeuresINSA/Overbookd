import { Adherent } from "@overbookd/festival-activity";
import { ApiProperty } from "@nestjs/swagger";
import { AdherentResponseDto } from "../../dto/adherent.response.dto";
import {
  APPROVED,
  Action,
  CREATED,
  KeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/http";

export class KeyEventResponseDto implements KeyEvent {
  @ApiProperty({ enum: [CREATED, READY_TO_REVIEW, APPROVED, REJECTED] })
  action: Action;

  @ApiProperty({ type: AdherentResponseDto })
  by: Adherent;

  @ApiProperty({})
  at: Date;

  @ApiProperty({})
  description: string;
}
