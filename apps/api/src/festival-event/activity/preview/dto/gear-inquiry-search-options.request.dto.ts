import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";
import { ActivityGearSearchOptions } from "@overbookd/http";

export class ActivityGearSearchOptionsRequestDto implements ActivityGearSearchOptions {
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
    description: "Gear drive",
  })
  @IsOptional()
  @IsString()
  drive?: string;
}
