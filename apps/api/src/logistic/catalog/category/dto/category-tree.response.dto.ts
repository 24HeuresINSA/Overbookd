import { ApiProperty } from "@nestjs/swagger";
import { CategoryResponseDto } from "./category.response.dto";
import { CatalogCategoryTree } from "@overbookd/logistic";

export class CategoryTreeResponseDto extends CategoryResponseDto {
  @ApiProperty({
    required: false,
    description: "Sub categories tree",
    type: CategoryTreeResponseDto,
    isArray: true,
  })
  subCategories?: CatalogCategoryTree[];
}
