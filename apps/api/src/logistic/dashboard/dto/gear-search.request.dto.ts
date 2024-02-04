import { ApiProperty } from "@nestjs/swagger";
import { GearSearchOptions } from "@overbookd/http";
import { IsOptional, IsString, MinLength } from "class-validator";

export class GearSearchRequestDto implements GearSearchOptions {
  @ApiProperty({
    required: false,
    description: "Gear name",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    required: false,
    description: "Category name",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  category?: string;

  @ApiProperty({
    required: false,
    description: "Owner name",
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  owner?: string;
}
