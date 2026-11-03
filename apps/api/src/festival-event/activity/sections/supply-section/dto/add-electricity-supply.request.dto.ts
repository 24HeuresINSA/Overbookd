import { ApiProperty } from "@nestjs/swagger";
import { PrepareElectricitySupplyCreation } from "@overbookd/festival-event";
import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";
import {
  electricityConnections,
  ElectricityConnection,
} from "@overbookd/festival-event-constants";

export class AddElectricitySupplyRequestDto implements PrepareElectricitySupplyCreation {
  @ApiProperty({ required: true, enum: electricityConnections })
  @IsEnum(electricityConnections, {
    message: () => "Le type de connexion est invalide",
  })
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
