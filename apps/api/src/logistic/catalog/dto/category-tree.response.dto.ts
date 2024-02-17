import { ApiProperty } from "@nestjs/swagger";
import { CategoryTree } from "../interfaces";
import { CategoryResponseDto } from "./category.response.dto";

export class CategoryTreeResponseDto extends CategoryResponseDto {
  @ApiProperty({
    required: false,
    description: "Sub categories tree",
    type: Object,
    isArray: true,
  })
  subCategories?: CategoryTree[];
}