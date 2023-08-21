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
  ExportSignaNeedRepresentation,
  SignaType,
  signaTypes,
} from "../fa-signa-need.model";

export class FaSignaNeedExportCsvResponseDto
  implements ExportSignaNeedRepresentation
{
  @ApiProperty({
    required: true,
    description: "the fa id",
  })
  @IsDefined()
  @IsNumber()
  faId: number;

  @ApiProperty({
    required: true,
    description: "the fa name",
  })
  @IsDefined()
  @IsString()
  faName: string;

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
