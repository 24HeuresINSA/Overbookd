import { ApiProperty } from "@nestjs/swagger";
import {
  BACHE,
  BaseSignage,
  Signage,
  SignageCatalogItem,
  SignageType,
  signageTypes,
} from "@overbookd/festival-activity";

export class UnassignedSignageResponseDto implements BaseSignage {
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

type SignageAssigned = Extract<Signage, { catalogItem: SignageCatalogItem }>;

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

export class AssignedSignageResponseDto
  extends UnassignedSignageResponseDto
  implements SignageAssigned
{
  @ApiProperty({
    required: true,
    type: SignageCatalogItemDto,
  })
  catalogItem: SignageCatalogItem;
}
