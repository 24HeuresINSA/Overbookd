import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from "class-validator";
import { VolunteerAssignmentRequest } from "../assignment.service";

class VolunteerAssignmentRequestDto implements VolunteerAssignmentRequest {
  @ApiProperty({
    required: true,
    description: "The id of the volunteer",
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  id: number;

  @ApiProperty({
    required: true,
    description: "The team code volunteer will be assigned as",
    type: String,
  })
  @IsString()
  teamCode: string;
}

export class AssignmentRequestDto {
  @ApiProperty({
    required: true,
    description: "The id of the volunteer",
    isArray: true,
    type: VolunteerAssignmentRequestDto,
  })
  @IsArray()
  @Type(() => VolunteerAssignmentRequestDto)
  @ValidateNested({ each: true })
  volunteers: VolunteerAssignmentRequestDto[];

  @ApiProperty({
    required: true,
    description: "The id of the time span",
    type: Number,
  })
  @IsNumber()
  @IsPositive()
  timeSpanId: number;
}

export class UpdateAssignedTeamRequestDto {
  @ApiProperty({
    required: true,
    description: "The team code volunteer will be assigned as",
    type: String,
  })
  @IsString()
  team: string;
}
