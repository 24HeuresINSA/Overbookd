import { ApiProperty } from "@nestjs/swagger";
import { CatalogGearForm } from "@overbookd/http";
import {
  IsBoolean,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class GearFormRequestDto implements CatalogGearForm {
  @ApiProperty({
    required: true,
    description: "Gear name",
  })
  @IsString()
  @IsDefined()
  @MinLength(3)
  name: string;

  @ApiProperty({
    required: true,
    description: "Gear usage",
  })
  @IsBoolean()
  @IsDefined()
  isPonctualUsage: boolean;

  @ApiProperty({
    required: true,
    description: "Gear consumable status",
  })
  @IsBoolean()
  @IsDefined()
  isConsumable: boolean;

  @ApiProperty({
    required: false,
    description: "Category id to link gear to",
  })
  @IsOptional()
  @IsInt()
  category?: number;
}
