import { ApiProperty } from "@nestjs/swagger";
import { UpdateTeamForm } from "../team.model";
import {
  IsOptional,
  IsString,
  Matches,
  ValidationArguments,
} from "class-validator";

const optionalHexCode = new RegExp("^#[0-9|a-f|A-F]{6}$");
const optionalMdiIcon = new RegExp("^mdi-.+");

export class UpdateTeamRequestDto implements UpdateTeamForm {
  @ApiProperty({
    required: false,
    description: "The team name",
    type: String,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: "The team color",
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(optionalHexCode, {
    message: (va: ValidationArguments) =>
      `${va.property} should be hexadecimal code starting with '#'`,
  })
  color?: string;

  @ApiProperty({
    required: false,
    description: "The team icon",
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(optionalMdiIcon, {
    message: (va: ValidationArguments) =>
      `${va.property} should be mdi icon code starting with 'mdi-'`,
  })
  icon?: string;
}
