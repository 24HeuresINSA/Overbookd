import { ApiProperty } from "@nestjs/swagger";
import {
  SignageType,
  signageTypes,
  PrepareSignageUpdate,
} from "@overbookd/festival-event";
import {
  IsEnum,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from "class-validator";

export type UpdateSignageRequest = Omit<PrepareSignageUpdate, "id">;

export class UpdateSignageRequestDto implements UpdateSignageRequest {
  @ApiProperty({
    required: false,
    enum: signageTypes,
  })
  @IsOptional()
  @IsEnum(signageTypes, {
    message: () => "Le type de signalétique est invalide",
  })
  type?: SignageType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @ApiProperty({ required: false, example: "Reculez" })
  @IsOptional()
  @IsString()
  text?: string;

  @ApiProperty({ required: false, example: "A0" })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== null)
  comment?: string | null;
}
