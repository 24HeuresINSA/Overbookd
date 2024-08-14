import { ApiProperty } from "@nestjs/swagger";
import { Preference } from "@overbookd/http";
import { pagesURL, PageURL, PLANNING_URL } from "@overbookd/web-page";

export class PreferenceResponseDto implements Preference {
  @ApiProperty({
    type: Boolean,
    description: "User want to receive his planning printed on a leaflet",
    example: false,
    nullable: true,
  })
  paperPlanning: boolean | null;

  @ApiProperty({
    description: "User preference for favorite pages",
    example: [PLANNING_URL],
    enum: pagesURL,
    isArray: true,
  })
  favoritePages: PageURL[];
}
