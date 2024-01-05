import { ApiProperty } from "@nestjs/swagger";
import { OfferMeal } from "@overbookd/http";
import { MIDI, MealDate, Moment, SOIR } from "@overbookd/personal-account";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsString, ValidateNested } from "class-validator";

const MOMENTS: Moment[] = [MIDI, SOIR];

class MealDateRepresentationDto implements MealDate {
  @ApiProperty({ description: "Day of the meal" })
  @IsDate()
  @Type(() => Date)
  day: Date;

  @ApiProperty({
    description: "On which hour meal will take place",
    enum: MOMENTS,
  })
  @IsEnum(MOMENTS)
  moment: Moment;
}

export class OfferMealRequestDto implements OfferMeal {
  @ApiProperty({})
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
