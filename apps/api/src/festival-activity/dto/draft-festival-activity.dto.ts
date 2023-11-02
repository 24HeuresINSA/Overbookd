import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  Draft,
  DRAFT,
  DraftGeneral,
  DraftInCharge,
  DraftSigna,
  ElectricitySupply,
  InquiryRequest,
  InquiryWithPotentialRequests,
  Security,
  Signage,
  Supply,
  TimeWindow,
} from "@overbookd/festival-activity";
import { AdherentResponseDto } from "./adherent.response.dto";
import { PeriodDto } from "./period.dto";

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

class GeneralSectionDto implements DraftGeneral {
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

class InChargeSectionDto implements DraftInCharge {
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
    isArray: true,
  })
  contractors: never[];
}

const signaTypes = ["BACHE", "PANNEAU", "AFFICHE"];

class SignageDto implements Signage {
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

class SignaSectionDto implements DraftSigna {
  @ApiProperty({
    description: "Define where this festival activity take place",
    required: false,
  })
  location: string | null;

  @ApiProperty({
    description: "Festival activity signages needed",
    isArray: true,
    type: SignageDto,
  })
  signages: Signage[];
}

class SecuritySectionDto implements Security {
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

class SupplySectionDto implements Supply {
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

class InquiryDto implements InquiryRequest {
  @ApiProperty({})
  id: number;

  @ApiProperty({})
  quantity: number;

  @ApiProperty({})
  name: string;
}

class InquirySectionDto implements InquiryWithPotentialRequests {
  @ApiProperty({
    description: "time windows during which you need requested stuff",
    isArray: true,
    type: PeriodDto,
  })
  timeWindows: TimeWindow[];

  @ApiProperty({
    isArray: true,
    type: InquiryDto,
  })
  gears: InquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: InquiryDto,
  })
  electricity: InquiryRequest[];

  @ApiProperty({
    isArray: true,
    type: InquiryDto,
  })
  barriers: InquiryRequest[];
}

export class DraftFestivalActivityDto implements Draft {
  @ApiProperty({})
  id: number;

  @ApiProperty({
    description: "Section related to festival activity general info",
    type: GeneralSectionDto,
  })
  general: Draft["general"];

  @ApiProperty({
    description: "Section related to festival activity in charge info",
    type: InChargeSectionDto,
  })
  inCharge: Draft["inCharge"];

  @ApiProperty({
    description: "Section related to festival activity signa info",
    type: SignaSectionDto,
  })
  signa: Draft["signa"];

  @ApiProperty({
    description: "Section related to festival activity security info",
    type: SecuritySectionDto,
  })
  security: Draft["security"];

  @ApiProperty({
    description: "Section related to festival activity supply info",
    type: SupplySectionDto,
  })
  supply: Draft["supply"];

  @ApiProperty({
    description: "Section related to festival activity inquiry info",
    type: InquirySectionDto,
  })
  inquiry: Draft["inquiry"];

  @ApiProperty({ enum: [DRAFT] })
  status: typeof DRAFT;
}
