import { ApiProperty } from "@nestjs/swagger";
import {
  PrepareGeneralUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
} from "@overbookd/festival-activity";
import { IsOptional } from "class-validator";
import { PrepareInChargeForm } from "../festival-activity.service";
import { FestivalActivity } from "@overbookd/festival-activity";

export class GeneralRequestDto implements PrepareGeneralUpdate {
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

export class InChargeRequestDto implements PrepareInChargeForm {
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

export class SignaRequestDto implements PrepareSignaUpdate {
  @ApiProperty({
    description: "Festival activity location",
    required: false,
  })
  @IsOptional()
  location?: string | null;
}

type PrepareSecurityUpdate = FestivalActivity["security"];

export class SecurityRequestDto implements PrepareSecurityUpdate {
  @ApiProperty({
    description: "Festival activity special security need",
    required: true,
  })
  specialNeed: string | null;
}

export class SupplyRequestDto implements PrepareSupplyUpdate {
  @ApiProperty({
    description: "Festival activity water supply",
    required: true,
  })
  water: string | null;
}
