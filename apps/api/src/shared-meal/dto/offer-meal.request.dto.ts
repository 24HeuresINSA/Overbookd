import { ApiProperty } from "@nestjs/swagger";
import { OfferMeal } from "@overbookd/http";
import { MIDI, MealDate, Moment, SOIR } from "@overbookd/personal-account";
import { DateString } from "@overbookd/time";
import { Type } from "class-transformer";
import { IsEnum, IsString, ValidateNested } from "class-validator";

const MOMENTS: Moment[] = [MIDI, SOIR];

class MealDateRepresentationDto implements MealDate {
  @ApiProperty({ description: "Day of the meal" })
  @IsString()
  day: DateString;

  @ApiProperty({
    description: "On which hour meal will take place",
    enum: MOMENTS,
  })
  @IsEnum(MOMENTS)
  moment: Moment;
}

export class OfferMealRequestDto implements OfferMeal {
  @ApiProperty()
  @IsString()
  menu: string;

  @ApiProperty({
    type: MealDateRepresentationDto,
    description: "When meal will take place",
  })
  @Type(() => MealDateRepresentationDto)
  @ValidateNested()
  date: MealDate;
}
