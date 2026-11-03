import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  PrepareElectricitySupplyUpdate,
} from "@overbookd/festival-event";
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from "class-validator";
import { supplyConnections } from "@overbookd/festival-event-constants";

export type UpdateElectricitySupplyRequest = Omit<
  PrepareElectricitySupplyUpdate,
  "id"
>;

export class UpdateElectricitySupplyRequestDto implements UpdateElectricitySupplyRequest {
  @ApiProperty({ required: false, enum: supplyConnections })
  @IsOptional()
  @IsEnum(supplyConnections, {
    message: () => "Le type de connexion est invalide",
  })
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
