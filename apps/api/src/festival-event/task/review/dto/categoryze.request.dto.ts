import { ApiProperty } from "@nestjs/swagger";
import {
  BAR,
  Categorize,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
  FestivalTaskReadyToAssign,
} from "@overbookd/festival-event";
import {
  IsEnum,
  ValidationArguments,
  IsOptional,
  IsDefined,
  IsBoolean,
} from "class-validator";

const CATEGORIES = [BAR, RELOU, MANUTENTION, FUN, STATIQUE];
export class CategorizeTaskRequestDto implements Categorize {
  @ApiProperty({ enum: CATEGORIES, required: false })
  @IsOptional()
  @IsEnum(CATEGORIES, {
    message: (va: ValidationArguments) =>
      `${va.property} must be one of ${Object.values(CATEGORIES)}`,
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
