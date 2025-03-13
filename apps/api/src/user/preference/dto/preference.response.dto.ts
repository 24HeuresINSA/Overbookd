import { ApiProperty } from "@nestjs/swagger";
import { assignmentPreferences, NO_PREF, Preference } from "@overbookd/http";
import { pagesURL, PLANNING_URL } from "@overbookd/web-page";

export class PreferenceResponseDto implements Preference {
  @ApiProperty({
    type: Boolean,
    description: "User want to receive his planning printed on a leaflet",
    example: false,
    nullable: true,
  })
  paperPlanning: Preference["paperPlanning"];

  @ApiProperty({
    description: "User want to choose his assignment preference",
    enum: assignmentPreferences,
    example: NO_PREF,
  })
  assignment: Preference["assignment"];

  @ApiProperty({
    description: "User preference for favorite pages",
    example: [PLANNING_URL],
    enum: pagesURL,
    isArray: true,
  })
  favoritePages: Preference["favoritePages"];
}
