import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  Matches,
  ValidationArguments,
} from "class-validator";
import { Team } from "../team.model";

const hexCode = new RegExp("^#[0-9|a-f|A-F]{6}$");
const mdiIcon = new RegExp("^mdi-.+");

export class CreateTeamRequestDto implements Team {
  @ApiProperty({
    required: true,
    description: "The name of the team",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    description: "The code of the team",
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    required: false,
    description: "The color of the team",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(hexCode, {
    message: (va: ValidationArguments) =>
      `${va.property} should be hexadecimal code starting with '#'`,
  })
  color: string;

  @ApiProperty({
    required: false,
    description: "The icon of the team",
  })
  @IsNotEmpty()
  @IsString()
  @Matches(mdiIcon, {
    message: (va: ValidationArguments) =>
      `${va.property} should be mdi icon code starting with 'mdi-'`,
  })
  icon: string;
}
