import { ApiProperty } from "@nestjs/swagger";
import { AddPageToFavorites } from "@overbookd/http";
import { pagesURL, PageURL, PLANNING_URL } from "@overbookd/web-page";
import { IsEnum } from "class-validator";

export class AddPageToFavoritesRequestDto implements AddPageToFavorites {
  @ApiProperty({
    enum: pagesURL,
    example: PLANNING_URL,
  })
  @IsEnum(pagesURL)
  page: PageURL;
}
