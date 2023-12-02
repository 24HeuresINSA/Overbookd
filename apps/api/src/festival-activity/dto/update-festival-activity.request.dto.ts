import { ApiProperty } from "@nestjs/swagger";
import {
  PrepareGeneralUpdate,
  PrepareInChargeForm,
  PrepareSignaForm,
  PrepareSupplyUpdate,
} from "@overbookd/festival-activity";
import { IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
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
  @IsString()
  @ValidateIf((_, value) => value !== null)
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
  @IsString()
  @ValidateIf((_, value) => value !== null)
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

export class SignaRequestDto implements PrepareSignaForm {
  @ApiProperty({
    description: "Festival activity location id",
    required: true,
  })
  @IsNumber()
  @ValidateIf((_, value) => value !== null)
  locationId: number | null;
}

type PrepareSecurityUpdate = FestivalActivity["security"];

export class SecurityRequestDto implements PrepareSecurityUpdate {
  @ApiProperty({
    description: "Festival activity special security need",
    required: true,
  })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  specialNeed: string | null;
}

export class SupplyRequestDto implements PrepareSupplyUpdate {
  @ApiProperty({
    description: "Festival activity water supply",
    required: true,
  })
  @IsString()
  @ValidateIf((_, value) => value !== null)
  water: string | null;
}
