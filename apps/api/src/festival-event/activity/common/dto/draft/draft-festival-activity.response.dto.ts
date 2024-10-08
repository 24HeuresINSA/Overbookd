import { ApiProperty } from "@nestjs/swagger";
import {
  Draft,
  InquiryWithPotentialRequests,
  Feedback,
  FestivalActivityKeyEvent as KeyEvent,
} from "@overbookd/festival-event";
import { DRAFT } from "@overbookd/festival-event-constants";
import { FeedbackResponseDto } from "../../../../common/dto/feedback.response.dto";
import { KeyEventResponseDto } from "../key-event.response.dto";
import { GeneralDto, General } from "./draft-general.response.dto";
import { InChargeDto, InCharge } from "./draft-in-charge.response.dto";
import { SignaDto, Signa } from "./draft-signa.response.dto";
import { SecurityDto, Security } from "./draft-security.response.dto";
import { SupplyDto, Supply } from "./draft-supply.response.dto";
import { InquiryDto } from "./draft-inquiry.response.dto";
import { FestivalTaskResponseDto } from "../festival-task.response.dto";

export class DraftFestivalActivityResponseDto implements Draft {
  @ApiProperty()
  id: number;

  @ApiProperty({
    description: "Section related to festival activity general info",
    type: GeneralDto,
  })
  general: General;

  @ApiProperty({
    description: "Section related to festival activity in charge info",
    type: InChargeDto,
  })
  inCharge: InCharge;

  @ApiProperty({
    description: "Section related to festival activity signa info",
    type: SignaDto,
  })
  signa: Signa;

  @ApiProperty({
    description: "Section related to festival activity security info",
    type: SecurityDto,
  })
  security: Security;

  @ApiProperty({
    description: "Section related to festival activity supply info",
    type: SupplyDto,
  })
  supply: Supply;

  @ApiProperty({
    description: "Section related to festival activity inquiry info",
    type: InquiryDto,
  })
  inquiry: InquiryWithPotentialRequests;

  @ApiProperty({ enum: [DRAFT] })
  status: typeof DRAFT;

  @ApiProperty({
    description: "Festival activity feedbacks",
    isArray: true,
    type: FeedbackResponseDto,
  })
  feedbacks: Feedback[];

  @ApiProperty({
    description: "Festival activity key events",
    isArray: true,
    type: KeyEventResponseDto,
  })
  history: KeyEvent[];

  @ApiProperty({
    description: "Festival activity tasks",
    isArray: true,
    type: FestivalTaskResponseDto,
  })
  tasks: Draft["tasks"];
}
