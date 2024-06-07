import { ApiProperty } from "@nestjs/swagger";
import { CatalogCategory, CategoryOwner } from "@overbookd/http";
import { CategoryOwnerResponseDto } from "./category-owner.response.dto";

export class CategoryResponseDto implements CatalogCategory {
  @ApiProperty({
    required: true,
    description: "Category id",
    type: Number,
  })
  id: number;

  @ApiProperty({
    required: true,
    description: "Category name",
    type: String,
  })
  name: string;

  @ApiProperty({
    required: true,
    description: "Category path",
    type: String,
  })
  path: string;

  @ApiProperty({
    required: false,
    description: "Parent Category id",
    type: Number,
  })
  parent?: number;

  @ApiProperty({
    required: false,
    description: "Category owner",
    type: CategoryOwnerResponseDto,
  })
  owner?: CategoryOwner;
}
