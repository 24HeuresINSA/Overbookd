import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidationArguments,
} from "class-validator";
import { SignageForm, signageTypes, SignageType } from "@overbookd/signa";

export class SignageFormRequestDto implements SignageForm {
  @ApiProperty({
    description: "The signage name",
    required: true,
    example: "Flèche verte",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "The signage type",
    required: true,
    example: signageTypes.PANNEAU,
  })
  @IsDefined()
  @IsEnum(signageTypes, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(signageTypes)}`,
  })
  type: SignageType;
}
