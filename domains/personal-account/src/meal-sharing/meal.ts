import { IInformAboutMeal } from "./meals.model";
import { IDefineMealDate } from "./meal-sharing";

export class Meal implements IInformAboutMeal {
  private constructor(
    readonly menu: string,
    readonly date: string,
  ) {}

  static init(menu: string, dateDefinition: IDefineMealDate): Meal {
    const date = this.buildDate(dateDefinition);
    return new Meal(menu, date);
  }

  private static buildDate({ day, moment }: IDefineMealDate) {
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
