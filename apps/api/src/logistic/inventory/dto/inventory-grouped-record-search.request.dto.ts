import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { Transform } from "class-transformer";
import { InventoryRecordSearchOptions } from "@overbookd/http";

export class InventoryGroupedRecordSearchRequestDto
  implements InventoryRecordSearchOptions
{
  @ApiProperty({
    required: false,
    description: "Gear name or reference",
  })
  @IsOptional()
  @IsString()
  search?: string;

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

  @ApiProperty({
    required: false,
    description: "Gear usage",
  })
  @IsOptional()
  @Transform(({ value }) => value === "true")
  @IsBoolean()
  ponctualUsage?: boolean;

  @ApiProperty({
    required: false,
    description: "Record storage location",
  })
  @IsOptional()
  @IsString()
  storage?: string;
}
