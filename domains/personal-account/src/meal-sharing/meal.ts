import { AboutMeal } from "./meals.model";
import { MealDate } from "./meal-sharing";

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
    return `${this.formatDay(day)} ${moment.toLowerCase()}`;
  }

  private static formatDay(day: Date): string {
    const displayOptions: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric",
      weekday: "long",
    };
    return new Intl.DateTimeFormat("fr", displayOptions).format(new Date(day));
  }
}
