import { ApiProperty } from "@nestjs/swagger";
import { CategorySearchOptions } from "@overbookd/http";
import { IsOptional, IsString, MinLength } from "class-validator";

export class CategorySearchRequestDto implements CategorySearchOptions {
  @ApiProperty({
    required: false,
    description: "Category name",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @ApiProperty({
    required: false,
    description: "Owner name",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  owner?: string;
}
