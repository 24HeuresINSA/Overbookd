import { ApiProperty } from "@nestjs/swagger";
import {
  Adherent,
  OnGoingSharedMeal,
  AboutMeal,
  Shotgun,
  PastSharedMeal,
  Expense,
} from "@overbookd/personal-account";

class AboutMealResponseDto implements AboutMeal {
  @ApiProperty({})
  menu: string;

  @ApiProperty({ description: "day with moment string" })
  date: string;
}

class AdherentResponseDto implements Adherent {
  @ApiProperty({})
  id: number;

  @ApiProperty({ description: "complete name" })
  name: string;
}

class ShotgunResponseDto extends AdherentResponseDto implements Shotgun {
  @ApiProperty({ type: Date, description: "when shotgun occured" })
  date: Date;
}

export class OnGoingSharedMealResponseDto implements OnGoingSharedMeal {
  @ApiProperty({})
  id: number;

  @ApiProperty({ type: AboutMealResponseDto })
  meal: AboutMeal;

  @ApiProperty({
    type: AdherentResponseDto,
    description: "Chef that offer meal",
  })
  chef: Adherent;

  @ApiProperty({ description: "shoutgun list", type: ShotgunResponseDto })
  shotguns: Shotgun[];

  @ApiProperty({ description: "shoutguns counter" })
  shotgunCount: number;
}

class ExpenseResponseDto implements Expense {
  @ApiProperty({ description: "total meal amount in cents" })
  amount: number;

  @ApiProperty({ description: "when expense occured", type: Date })
  date: Date;
}

export class PastSharedMealResponseDto
  extends OnGoingSharedMealResponseDto
  implements PastSharedMeal
{
  @ApiProperty({ type: ExpenseResponseDto })
  expense: Expense;

  @ApiProperty({ description: "guests that shotgun before expense occur" })
  inTimeShotguns: number;
}
