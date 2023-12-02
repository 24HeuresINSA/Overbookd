import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  P17_125A_TETRA,
  P17_16A_MONO,
  P17_16A_TETRA,
  P17_16A_TRI,
  P17_32A_MONO,
  P17_32A_TETRA,
  P17_32A_TRI,
  P17_63A_MONO,
  P17_63A_TETRA,
  P17_63A_TRI,
  PC16_Prise_classique,
  PrepareGeneralUpdate,
  PrepareSupplyUpdate,
  AFFICHE,
  BACHE,
  PANNEAU,
  SignageType,
} from "@overbookd/festival-activity";
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from "class-validator";
import {
  PrepareInChargeForm,
  PrepareSignaForm,
} from "../festival-activity.service";
import { FestivalActivity } from "@overbookd/festival-activity";
import {
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
} from "@overbookd/festival-activity/src/preparation/prepare-festival-activity.model";
import { signageTypes } from "@overbookd/signa";

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

export class SignaRequestDto implements PrepareSignaForm {
  @ApiProperty({
    description: "Festival activity location id",
    required: true,
  })
  locationId: number | null;
}

export class AddSignageRequestDto implements PrepareSignageCreation {
  @ApiProperty({
    required: true,
    enum: [BACHE, PANNEAU, AFFICHE],
  })
  @IsEnum([BACHE, PANNEAU, AFFICHE])
  type: SignageType;

  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true, example: "Reculez" })
  text: string;

  @ApiProperty({
    example: "A0",
    required: true,
  })
  size: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  comment?: string;
}

export type UpdateSignageRequest = Omit<PrepareSignageUpdate, "id">;

export class UpdateSignageRequestDto implements UpdateSignageRequest {
  @ApiProperty({
    required: false,
    enum: signageTypes,
  })
  @IsEnum(signageTypes)
  @IsOptional()
  type?: SignageType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ required: false, example: "Reculez" })
  @IsOptional()
  text?: string;

  @ApiProperty({ required: false, example: "A0" })
  @IsOptional()
  size?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  comment?: string | null;
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

const connections = [
  PC16_Prise_classique,
  P17_16A_MONO,
  P17_16A_TRI,
  P17_16A_TETRA,
  P17_32A_MONO,
  P17_32A_TRI,
  P17_32A_TETRA,
  P17_63A_MONO,
  P17_63A_TRI,
  P17_63A_TETRA,
  P17_125A_TETRA,
] as const;

export class AddElectricitySupplyRequestDto
  implements PrepareElectricitySupplyCreation
{
  @ApiProperty({ required: true, enum: connections })
  @IsEnum(connections)
  connection: ElectricityConnection;

  @ApiProperty({ required: true, example: "Lampe" })
  device: string;

  @ApiProperty({ required: true, example: 300 })
  @IsPositive()
  power: number;

  @ApiProperty({ required: true })
  @IsPositive()
  count: number;

  @ApiProperty({ required: false })
  @IsOptional()
  comment?: string;
}

export type UpdateElectricitySupplyRequest = Omit<
  PrepareElectricitySupplyUpdate,
  "id"
>;

export class UpdateElectricitySupplyRequestDto
  implements UpdateElectricitySupplyRequest
{
  @ApiProperty({ required: false, enum: connections })
  @IsOptional()
  @IsEnum(connections)
  connection?: ElectricityConnection;

  @ApiProperty({ required: false, example: "Lampe" })
  @IsOptional()
  device?: string;

  @ApiProperty({ required: false, example: 300 })
  @IsOptional()
  @IsPositive()
  power?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  count?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  comment?: string | null;
}
