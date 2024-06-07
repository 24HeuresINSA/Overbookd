import { ApiProperty } from "@nestjs/swagger";
import {
  CatalogCategoryIdentifier,
  CatalogGear,
  CategoryOwner,
} from "@overbookd/http";
import { CategoryOwnerResponseDto } from "../../catalog/dto/category-owner.response.dto";
import { CatalogCategoryIdentifierResponseDto } from "./catalog-category-identifier.dto";

export class CatalogGearResponseDto implements CatalogGear {
  @ApiProperty({
    required: true,
    description: "Gear id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "Gear name",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "Gear slug",
    type: String,
  })
  slug: string;

  @ApiProperty({
    required: false,
    description: "Gear category",
    type: CatalogCategoryIdentifierResponseDto,
  })
  category?: CatalogCategoryIdentifier;

  @ApiProperty({
    required: false,
    description: "Gear owner",
    type: CategoryOwnerResponseDto,
  })
  owner?: CategoryOwner;

  @ApiProperty({
    required: false,
    description: "Gear reference code",
    type: String,
  })
  code?: string;

  @ApiProperty({
    required: true,
    description: "Gear usage",
  })
  isPonctualUsage: boolean;

  @ApiProperty({
    required: true,
    description: "Gear consumable status",
  })
  isConsumable: boolean;
}
