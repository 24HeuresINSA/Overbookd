import { ApiProperty } from "@nestjs/swagger";
import {
  SignageType,
  signageTypes,
  PrepareSignageCreation,
} from "@overbookd/festival-event";
import { IsEnum, IsOptional, IsPositive, IsString } from "class-validator";

export class AddSignageRequestDto implements PrepareSignageCreation {
  @ApiProperty({
    required: true,
    enum: signageTypes,
  })
  @IsEnum(signageTypes, {
    message: () => "Le type de signalétique est invalide",
  })
  type: SignageType;

  @ApiProperty({ required: true })
  @IsPositive()
  quantity: number;

  @ApiProperty({ required: true, example: "Reculez" })
  @IsString()
  text: string;

  @ApiProperty({
    example: "A0",
    required: true,
  })
  @IsString()
  size: string;

  @ApiProperty({
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
