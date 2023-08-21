import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidationArguments,
} from "class-validator";
import {
  FaSignaNeedWithOptionalIdRepresentation,
  SignaType,
  signaTypes,
} from "../fa-signa-need.model";

export class UpsertFaSignaNeedRequestDto
  implements FaSignaNeedWithOptionalIdRepresentation
{
  @ApiProperty({
    required: false,
    description: "The id of the need",
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    required: true,
    description: "The type of signalisation",
    enum: signaTypes,
  })
  @IsDefined()
  @IsEnum(signaTypes, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(signaTypes)}`,
  })
  signaType: SignaType;

  @ApiProperty({
    required: true,
    description: "The text to display",
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    required: true,
    description: "The number of signa",
  })
  @IsDefined()
  @IsNumber()
  @Min(1)
  count: number;

  @ApiProperty({
    required: false,
    description: "The size of signa",
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    required: false,
    description: "Any comment about signa",
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
