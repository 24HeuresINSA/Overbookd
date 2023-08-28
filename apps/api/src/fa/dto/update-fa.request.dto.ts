import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidationArguments,
} from "class-validator";
import { FaStatus, faStatuses } from "../fa.model";

enum FaType {
  Concert = "Concert",
  Course = "Course",
  Divertissement = "Divertissement",
  Initiation = "Initiation",
  Tournoi = "Tournoi",
  Vente = "Vente",
  Prevention = "Prevention",
  Spectacle = "Spectacle",
  Autre = "Autre",
}

export class UpdateFaRequestDto {
  @ApiProperty({
    required: true,
    description: "The name of the fa",
  })
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: false,
    description: "The type of the fa",
    enum: FaType,
  })
  @IsOptional()
  @IsEnum(FaType, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(FaType)}`,
  })
  type?: FaType;

  @ApiProperty({
    required: false,
    description: "The id of the team whos responsible of the fa",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  teamId?: number;

  @ApiProperty({
    required: false,
    description: "The id of the user who is responsible of the fa",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  userInChargeId?: number;

  @ApiProperty({
    required: false,
    description: "The id of the location of the fa",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  locationId?: number;

  @ApiProperty({
    required: false,
    description: "The status of the fa",
    enum: faStatuses,
  })
  @IsOptional()
  @IsEnum(faStatuses, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(faStatuses)}`,
  })
  status?: FaStatus;

  @ApiProperty({
    required: false,
    description: "The description of the fa",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    required: false,
    description: "Is the activity publishable on the website",
  })
  @IsOptional()
  @IsBoolean()
  isPublishable?: boolean;

  @ApiProperty({
    required: false,
    description: "Link of the photo",
  })
  @IsOptional()
  @IsString()
  photoLink?: string;

  @ApiProperty({
    required: false,
    description: "The security needs",
  })
  @IsOptional()
  @IsString()
  securityNeed?: string;

  @ApiProperty({
    required: false,
    description: "Number of security pass if required",
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  numberOfPass?: number;

  @ApiProperty({
    required: false,
    description: "Text description about water",
  })
  @IsOptional()
  @IsString()
  waterNeed?: string;
}
