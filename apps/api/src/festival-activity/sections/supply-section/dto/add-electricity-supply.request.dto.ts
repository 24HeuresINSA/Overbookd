import { ApiProperty } from "@nestjs/swagger";
import {
  ElectricityConnection,
  PrepareElectricitySupplyCreation,
} from "@overbookd/festival-activity";
import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";
import { connections } from "./connections";

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
