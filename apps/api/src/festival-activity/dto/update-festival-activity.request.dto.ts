import { ApiProperty } from "@nestjs/swagger";
import {
  PrepareGeneralSection,
  PrepareInChargeSection,
  PrepareSecuritySection,
  PrepareSignaSection,
  PrepareSupplySection,
} from "@overbookd/festival-activity";
import { IsOptional } from "class-validator";

export class GeneralSectionRequestDto implements PrepareGeneralSection {
  @ApiProperty({
    description: "Festival activity name",
    required: false,
  })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: "Festival activity presentation",
    required: false,
  })
  @IsOptional()
  description?: string | null;

  @ApiProperty({
    description: "Festival activity categories",
    isArray: true,
    required: false,
  })
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    description:
      "Do we whant to publish this festival activity to our web site",
    required: false,
  })
  @IsOptional()
  toPublish?: boolean;

  @ApiProperty({
    description: "Festival activity photo link",
    required: false,
  })
  @IsOptional()
  photoLink?: string | null;

  @ApiProperty({
    description:
      "Define which festival activities are most important ones (i.e. are flagship)",
    required: false,
  })
  @IsOptional()
  isFlagship?: boolean;
}

export class InChargeSectionRequestDto implements PrepareInChargeSection {
  @ApiProperty({
    description: "Festival activity adherent id in charge",
    required: false,
  })
  @IsOptional()
  adherentId?: number;

  @ApiProperty({
    description: "Festival activity team in charge",
    required: false,
  })
  @IsOptional()
  team?: string;
}

export class SignaSectionRequestDto implements PrepareSignaSection {
  @ApiProperty({
    description: "Festival activity location",
    required: false,
  })
  @IsOptional()
  location?: string | null;
}

export class SecuritySectionRequestDto implements PrepareSecuritySection {
  @ApiProperty({
    description: "Festival activity special security need",
    required: false,
  })
  @IsOptional()
  specialNeed?: string | null;
}

export class SupplySectionRequestDto implements PrepareSupplySection {
  @ApiProperty({
    description: "Festival activity water supply",
    required: false,
  })
  @IsOptional()
  water?: string | null;
}
