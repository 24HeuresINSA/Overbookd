import { ApiProperty } from "@nestjs/swagger";
import {
  BACHE,
  BaseSignage,
  Signage,
  SignageCatalogItem,
  SignageType,
  signageTypes,
} from "@overbookd/festival-activity";

export class UnlinkedSignageResponseDto implements BaseSignage {
  @ApiProperty({})
  id: string;

  @ApiProperty({
    description: "Wanted quantity for this signage",
  })
  quantity: number;

  @ApiProperty({})
  text: string;

  @ApiProperty({})
  size: string;

  @ApiProperty({
    enum: signageTypes,
    example: BACHE,
  })
  type: SignageType;

  @ApiProperty({})
  comment: string;
}

type SignageLinked = Extract<Signage, { catalogItem: SignageCatalogItem }>;

class SignageCatalogItemDto implements SignageCatalogItem {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({
    required: true,
    enum: signageTypes,
    example: BACHE,
  })
  type: SignageType;
}

export class LinkedSignageResponseDto
  extends UnlinkedSignageResponseDto
  implements SignageLinked
{
  @ApiProperty({
    required: true,
    type: SignageCatalogItemDto,
  })
  catalogItem: SignageCatalogItem;
}
