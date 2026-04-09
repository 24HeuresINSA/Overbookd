import { ApiProperty } from "@nestjs/swagger";
import { SignageCatalogItem } from "@overbookd/festival-event";
import { LinkSignageCatalogItemForm } from "@overbookd/http";
import { IsNumber } from "class-validator";

export class LinkSignageCatalogItemRequestDto implements LinkSignageCatalogItemForm {
  @ApiProperty({ required: true })
  @IsNumber()
  catalogItemId: SignageCatalogItem["id"];
}
