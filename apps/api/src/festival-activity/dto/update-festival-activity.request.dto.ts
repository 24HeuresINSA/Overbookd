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
  PrepareSupplyUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareFeedbackPublish,
  Drive,
  drives,
  PrepareSecurityUpdate,
} from "@overbookd/festival-activity";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { AddInquiryRequest, InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PeriodDto } from "../common/dto/period.dto";
import { Type } from "class-transformer";

export class SecurityRequestDto implements PrepareSecurityUpdate {
  @ApiProperty({
    description: "Festival activity special security need",
    required: false,
  })
  @IsString()
  @IsOptional()
  specialNeed?: string | null;

  @ApiProperty({
    description: "Festival activity free pass number",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  freePass?: number;
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
  @IsString()
  device: string;

  @ApiProperty({ required: true, example: 300 })
  @IsPositive()
  power: number;

  @ApiProperty({ required: true })
  @IsPositive()
  count: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
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
  @IsString()
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

export class AddInquiryRequestDto implements AddInquiryRequest {
  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true })
  @IsString()
  slug: string;
}

export class LinkInquiryDriveRequestDto {
  @ApiProperty({ required: true, enum: drives })
  @IsEnum(drives)
  drive: Drive;
}

export class InitInquiryRequestDto implements InitInquiryRequest {
  @ApiProperty({
    required: true,
    type: PeriodDto,
  })
  @Type(() => PeriodDto)
  @ValidateNested()
  timeWindow: IProvidePeriod;

  @ApiProperty({
    required: true,
    type: AddInquiryRequestDto,
  })
  @Type(() => AddInquiryRequestDto)
  @ValidateNested()
  request: AddInquiryRequest;
}

export class AddFeedbackRequestDto implements PrepareFeedbackPublish {
  @ApiProperty({ required: true })
  @IsString()
  content: string;
}
