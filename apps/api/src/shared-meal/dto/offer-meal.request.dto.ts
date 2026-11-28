import { ApiProperty } from "@nestjs/swagger";
import { OfferMeal } from "@overbookd/http";
import { MIDI, MealDate, Moment, SOIR } from "@overbookd/personal-account";
import { DateString } from "@overbookd/time";
import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from "class-validator";

const MOMENTS: Moment[] = [MIDI, SOIR];

class MealDateRepresentationDto implements MealDate {
  @ApiProperty({ description: "Day of the meal" })
  @IsString()
  day: DateString;

  @ApiProperty({
    description: "At which time the meal will take place",
    enum: MOMENTS,
  })
  @IsEnum(MOMENTS)
  moment: Moment;
}

export class OfferMealRequestDto implements OfferMeal {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  menu: string;

  @ApiProperty({
    type: MealDateRepresentationDto,
    description: "When meal will take place",
  })
  @Type(() => MealDateRepresentationDto)
  @ValidateNested()
  date: MealDate;

  @ApiProperty()
  @IsBoolean()
  areMultipleShotgunsAllowed: boolean;
}
