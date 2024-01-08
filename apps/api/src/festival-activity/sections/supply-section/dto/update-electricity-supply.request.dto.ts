import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  PrepareElectricitySupplyUpdate
} from "@overbookd/festival-activity";
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf
} from "class-validator";
import { connections } from "./connections";


export type UpdateElectricitySupplyRequest = Omit<
  PrepareElectricitySupplyUpdate, "id"
>;

export class UpdateElectricitySupplyRequestDto
  implements UpdateElectricitySupplyRequest {
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
