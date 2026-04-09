import { ApiProperty } from "@nestjs/swagger";
import { CatalogCategoryTree } from "@overbookd/http";
import { CategoryResponseDto } from "./category.response.dto";

export class CategoryTreeResponseDto extends CategoryResponseDto {
  @ApiProperty({
    required: false,
    description: "Sub categories tree",
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  subCategories?: CatalogCategoryTree[];
}
