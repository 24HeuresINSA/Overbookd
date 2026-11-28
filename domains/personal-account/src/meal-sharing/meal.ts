import { AboutMeal } from "./meals.model.js";
import { MealDate } from "./meal-sharing.js";
import { EmptyMenu } from "./meal-sharing.error.js";
import { OverDate, formatDateDayToHumanReadable } from "@overbookd/time";

export class Meal implements AboutMeal {
  private constructor(
    readonly menu: string,
    readonly date: string,
  ) {}

  static init(menu: string, dateDefinition: MealDate): Meal {
    const date = this.buildDate(dateDefinition);
    return new Meal(this.checkMenu(menu), date);
  }

  static updateMenu({ date }: AboutMeal, menu: string): Meal {
    return new Meal(this.checkMenu(menu), date);
  }

  private static checkMenu(menu: string): string {
    if (!menu.trim()) throw new EmptyMenu();
    return menu;
  }

  private static buildDate({ day, moment }: MealDate) {
    const formattedDay = formatDateDayToHumanReadable(OverDate.from(day).date);
    return `${formattedDay} ${moment.toLowerCase()}`;
  }
}
