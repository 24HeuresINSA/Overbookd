import { ApiProperty } from "@nestjs/swagger";
import type { AssignmentPreference } from "@overbookd/http";
import {
  assignmentPreferences,
  NO_PREF,
  type AssignmentPreferenceType,
} from "@overbookd/preference";
import { IsEnum } from "class-validator";

export class AssignmentPreferenceDto implements AssignmentPreference {
  @ApiProperty({
    description: "User want to chose his assignment preference",
    enum: assignmentPreferences,
    example: NO_PREF,
  })
  @IsEnum(assignmentPreferences, { message: () => "Préférence non existante" })
  assignment: AssignmentPreferenceType;
}
