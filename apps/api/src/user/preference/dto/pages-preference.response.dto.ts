import { ApiProperty } from "@nestjs/swagger";
import { PagesPreference } from "@overbookd/http";
import { pagesURL, PageURL, PLANNING_URL } from "@overbookd/web-page";

export class PagesPreferenceResponseDto implements PagesPreference {
  @ApiProperty({
    description: "User preference for favorite pages",
    example: [PLANNING_URL],
    enum: pagesURL,
    isArray: true,
  })
  favoritePages: PageURL[];
}
