import { AboutMeal } from "./meals.model.js";
import { MealDate } from "./meal-sharing.js";
import { OverDate, formatDateDayToHumanReadable } from "@overbookd/time";

export class Meal implements AboutMeal {
  private constructor(
    readonly menu: string,
    readonly date: string,
  ) {}

  static init(menu: string, dateDefinition: MealDate): Meal {
    const date = this.buildDate(dateDefinition);
    return new Meal(menu, date);
  }

  private static buildDate({ day, moment }: MealDate) {
    const formattedDay = formatDateDayToHumanReadable(OverDate.from(day).date);
    return `${formattedDay} ${moment.toLowerCase()}`;
  }
}
