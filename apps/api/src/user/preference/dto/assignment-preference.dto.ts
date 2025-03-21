import { ApiProperty } from "@nestjs/swagger";
import {
  type AssignmentPreference,
  type AssignmentType,
  assignmentPreferences,
  NO_PREF,
} from "@overbookd/http";
import { IsEnum } from "class-validator";

export class AssignmentPreferenceDto implements AssignmentPreference {
  @ApiProperty({
    description: "User want to chose his assignment preference",
    enum: assignmentPreferences,
    example: NO_PREF,
  })
  @IsEnum(assignmentPreferences, { message: () => "Préférence non existante" })
  assignment: AssignmentType;
}
