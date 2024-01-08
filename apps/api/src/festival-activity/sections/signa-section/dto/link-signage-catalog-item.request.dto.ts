import { ApiProperty } from "@nestjs/swagger";
import { SignageCatalogItem } from "@overbookd/festival-activity";
import { IsNumber } from "class-validator";
import { LinkSignageCatalogItemForm } from "@overbookd/http";

export class LinkSignageCatalogItemRequestDto
  implements LinkSignageCatalogItemForm
{
  @ApiProperty({ required: true })
  @IsNumber()
  catalogItemId: SignageCatalogItem["id"];
}
