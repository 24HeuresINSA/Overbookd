import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidationArguments,
} from "class-validator";
import { SignageUpdateForm, signageTypes, SignageType } from '@overbookd/signa';

export class UpdateSignageRequestDto implements SignageUpdateForm {
  @ApiProperty({
    description: 'The signage id',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The signage name',
    required: true,
    example: 'Panneau vert',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The signage type',
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
