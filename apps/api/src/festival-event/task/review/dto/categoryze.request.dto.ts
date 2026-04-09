import { ApiProperty } from "@nestjs/swagger";
import {
  Categorize,
  FestivalTaskReadyToAssign,
} from "@overbookd/festival-event";
import { taskCategories } from "@overbookd/festival-event-constants";
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsOptional,
  ValidationArguments,
} from "class-validator";

export class CategorizeTaskRequestDto implements Categorize {
  @ApiProperty({ enum: taskCategories, required: false })
  @IsOptional()
  @IsEnum(taskCategories, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(taskCategories)}`,
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
