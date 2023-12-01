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
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";
import { PeriodDto } from "./period.dto";
import { ContractorResponseDto } from "./contractor.response.dto";

class TimeWindowDto implements TimeWindow {
  @ApiProperty({
    description: "Festival activity time window id",
  })
  id: string;

  @ApiProperty({
    description: "Festival activity time window start date",
    type: Date,
  })
  start: Date;

  @ApiProperty({
    description: "Festival activity time window end date",
    type: Date,
  })
  end: Date;
}

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
    type: TimeWindowDto,
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
    required: false,
  })
  team: string | null;

  @ApiProperty({
    description: "Contractors in charge of this festival activity",
    type: ContractorResponseDto,
    isArray: true,
  })
  contractors: Contractor[];
}

const signaTypes = ["BACHE", "PANNEAU", "AFFICHE"];

class SignageDto implements Signage {
  @ApiProperty({})
  id: string;

  @ApiProperty({
    description: "Wanted quantity for this signage",
  })
  quantity: number;

  @ApiProperty({})
  text: string;

  @ApiProperty({})
  size: string;

  @ApiProperty({
    enum: signaTypes,
    example: "BACHE",
  })
  type: "BACHE" | "PANNEAU" | "AFFICHE";

  @ApiProperty({})
  comment: string;
}

type Signa = Draft["signa"];

class SignaDto implements Signa {
  @ApiProperty({
    description: "Define where this festival activity take place",
    required: false,
  })
  location: Location | null;

  @ApiProperty({
    description: "Festival activity signages needed",
    isArray: true,
    type: SignageDto,
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
}

const electricitySupplyConnections = [
  "PC16_Prise_classique",
  "P17_16A_MONO",
  "P17_16A_TRI",
  "P17_16A_TETRA",
  "P17_32A_MONO",
  "P17_32A_TRI",
  "P17_32A_TETRA",
  "P17_63A_MONO",
  "P17_63A_TRI",
  "P17_63A_TETRA",
  "P17_125A_TETRA",
];

class ElectricitySupplyDto implements ElectricitySupply {
  @ApiProperty({})
  id: string;

  @ApiProperty({
    enum: electricitySupplyConnections,
    example: "PC16_Prise_classique",
  })
  connection:
    | "PC16_Prise_classique"
    | "P17_16A_MONO"
    | "P17_16A_TRI"
    | "P17_16A_TETRA"
    | "P17_32A_MONO"
    | "P17_32A_TRI"
    | "P17_32A_TETRA"
    | "P17_63A_MONO"
    | "P17_63A_TRI"
    | "P17_63A_TETRA"
    | "P17_125A_TETRA";

  @ApiProperty({})
  device: string;

  @ApiProperty({})
  power: number;

  @ApiProperty({})
  count: number;

  @ApiProperty({
    required: false,
  })
  comment: string | null;
}

type Supply = Draft["supply"];

class SupplyDto implements Supply {
  @ApiProperty({
    isArray: true,
    type: ElectricitySupplyDto,
  })
  electricity: ElectricitySupply[];

  @ApiProperty({
    required: false,
  })
  water: string | null;
}

class InquiryRequestDto implements BaseInquiryRequest {
  @ApiProperty({})
  slug: string;

  @ApiProperty({})
  quantity: number;

  @ApiProperty({})
  name: string;
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
    type: InquiryRequestDto,
  })
  gears: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: InquiryRequestDto,
  })
  electricity: BaseInquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: InquiryRequestDto,
  })
  barriers: BaseInquiryRequest[];
}

class FeedbackDto implements Feedback {
  @ApiProperty({
    type: AdherentResponseDto,
  })
  author: Adherent;

  @ApiProperty({})
  content: string;

  @ApiProperty({})
  publishedAt: Date;
}

export class DraftFestivalActivityDto implements Draft {
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
    type: FeedbackDto,
  })
  feedbacks: Feedback[];
}
