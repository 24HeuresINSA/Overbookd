import { ApiProperty } from "@nestjs/swagger";
import {
  Categorize,
  FestivalTaskReadyToAssign,
} from "@overbookd/festival-event";
import { categories } from "@overbookd/festival-event-constants";
import {
  IsEnum,
  ValidationArguments,
  IsOptional,
  IsDefined,
  IsBoolean,
} from "class-validator";

export class CategorizeTaskRequestDto implements Categorize {
  @ApiProperty({ enum: categories, required: false })
  @IsOptional()
  @IsEnum(categories, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(categories)}`,
  })
  category?: FestivalTaskReadyToAssign["category"];

  @ApiProperty({
    description: "Indicate task is top priority to assign",
    required: true,
  })
  @IsDefined()
  @IsBoolean()
  topPriority: FestivalTaskReadyToAssign["topPriority"];
}
