import { ApiProperty } from "@nestjs/swagger";
import {
  GeneralSection,
  InChargeSectionForm,
  SecuritySection,
  SignaSection,
  Signage,
  SupplySection,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "./period.dto";

export class GeneralSectionRequestDto implements Partial<GeneralSection> {
  @ApiProperty({
    description: "Festival activity name",
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Festival activity presentation",
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: "Festival activity categories",
    isArray: true,
    required: false,
  })
  categories?: string[];

  @ApiProperty({
    description:
      "Do we whant to publish this festival activity to our web site",
    required: false,
  })
  toPublish?: boolean;

  @ApiProperty({
    description: "Festival activity photo link",
    required: false,
  })
  photoLink?: string | null;

  @ApiProperty({
    description:
      "Define which festival activities are most important ones (i.e. are flagship)",
    required: false,
  })
  isFlagship?: boolean;

  @ApiProperty({
    description: "time windows during which this festival activity occurs",
    isArray: true,
    type: PeriodDto,
    required: false,
  })
  timeWindows?: IProvidePeriod[];
}

export class InChargeSectionRequestDto implements Partial<InChargeSectionForm> {
  @ApiProperty({
    description: "Festival activity adherent id in charge",
    required: false,
  })
  adherentId?: number;

  @ApiProperty({
    description: "Festival activity team in charge",
    required: false,
  })
  team?: string;

  @ApiProperty({
    description: "Festival activity contractors in charge",
    isArray: true,
    required: false,
  })
  contractors?: never[];
}

export class SignaSectionRequestDto implements Partial<SignaSection> {
  @ApiProperty({
    description: "Festival activity location",
    required: false,
  })
  location?: string | null;

  @ApiProperty({
    description: "Festival activity signages",
    isArray: true,
    required: false,
  })
  signage?: Signage[];
}

export class SecuritySectionRequestDto implements Partial<SecuritySection> {
  @ApiProperty({
    description: "Festival activity special security need",
    required: false,
  })
  specialNeed?: string | null;
}

export class SupplySectionRequestDto implements Partial<SupplySection> {
  @ApiProperty({
    description: "Festival activity electricity supply",
    isArray: true,
    required: false,
  })
  electricity?: never[];

  @ApiProperty({
    description: "Festival activity water supply",
    required: false,
  })
  water?: string | null;
}
