import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  Contractor,
  Draft,
  DRAFT,
  ElectricitySupply,
  BaseInquiryRequest,
  InquiryWithPotentialRequests,
  Signage,
  TimeWindow,
  Location,
  Feedback,
  KeyEvent,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";
import { PeriodDto } from "./period.dto";
import { ContractorResponseDto } from "./contractor.response.dto";
import { UnlinkedSignageResponseDto } from "./signage.response.dto";
import { TimeWindowResponseDto } from "./time-window.response.dto";
import { LocationResponseDto } from "./location.response.dto";
import { ElectricitySupplyResponseDto } from "./electricity-supply.response.dto";
import { FeedbackResponseDto } from "./feedback.response.dto";
import { UnassignedInquiryRequestResponseDto } from "./inquiry-request.response.dto";
import { KeyEventResponseDto } from "./key-event.response.dto";

type General = Draft["general"];

class GeneralDto implements General {
  @ApiProperty({
    description: "Festival activity name",
  })
  name: string;

  @ApiProperty({
    description: "Festival activity presentation",
    required: false,
  })
  description: string | null;

  @ApiProperty({
    description: "Festival activity categories",
    isArray: true,
  })
  categories: string[];

  @ApiProperty({
    description:
      "Do we whant to publish this festival activity to our web site",
  })
  toPublish: boolean;

  @ApiProperty({
    description: "Festival activity photo link",
    required: false,
  })
  photoLink: string | null;

  @ApiProperty({
    description:
      "Define which festival activities are most important ones (i.e. are flagship)",
  })
  isFlagship: boolean;

  @ApiProperty({
    description: "time windows during which this festival activity occurs",
    isArray: true,
    type: TimeWindowResponseDto,
  })
  timeWindows: TimeWindow[];
}

type InCharge = Draft["inCharge"];

class InChargeDto implements InCharge {
  @ApiProperty({
    description: "Adherent in charge of this festival activity",
    type: AdherentResponseDto,
  })
  adherent: Adherent;

  @ApiProperty({
    description: "Team in charge of this festival activity",
    required: true,
    nullable: true,
  })
  team: string | null;

  @ApiProperty({
    description: "Contractors in charge of this festival activity",
    type: ContractorResponseDto,
    isArray: true,
  })
  contractors: Contractor[];
}

type Signa = Draft["signa"];

class SignaDto implements Signa {
  @ApiProperty({
    description: "Define where this festival activity take place",
    required: true,
    nullable: true,
    type: LocationResponseDto,
  })
  location: Location | null;

  @ApiProperty({
    description: "Festival activity signages needed",
    isArray: true,
    type: UnlinkedSignageResponseDto,
  })
  signages: Signage[];
}

type Security = Draft["security"];

class SecurityDto implements Security {
  @ApiProperty({
    description: "Describe safety features for this festival activity",
    required: false,
  })
  specialNeed: string | null;

  @ApiProperty({
    description: "Number of free pass for this festival activity",
    required: true,
  })
  freePass: number;
}

type Supply = Draft["supply"];

class SupplyDto implements Supply {
  @ApiProperty({
    isArray: true,
    type: ElectricitySupplyResponseDto,
  })
  electricity: ElectricitySupply[];

  @ApiProperty({
    required: false,
  })
  water: string | null;
}

class InquiryDto implements InquiryWithPotentialRequests {
  @ApiProperty({
    description: "time windows during which you need requested stuff",
    isArray: true,
    type: PeriodDto,
  })
  timeWindows: TimeWindow[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  gears: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  electricity: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: UnassignedInquiryRequestResponseDto,
  })
  barriers: BaseInquiryRequest[];
}

export class DraftFestivalActivityResponseDto implements Draft {
  @ApiProperty({})
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
}
