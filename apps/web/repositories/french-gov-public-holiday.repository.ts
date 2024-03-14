import { isDateString } from "@overbookd/period";
import { PublicHoliday } from "~/store/publicHoliday";

type FrenchGouvPublicHoliday = {
  [date: string]: string;
};

export class FrenchGovPublicHolidayRepository {
  static async all(): Promise<PublicHoliday[]> {
    const path = "https://calendrier.api.gouv.fr/jours-feries/metropole.json";

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        "❌ Impossible de récupérer les jours fériés de gouv.fr.",
      );
    }
    const data: FrenchGouvPublicHoliday = await response.json();

    return Object.entries(data)
      .filter(([date]) => isDateString(date))
      .map(([date, name]) => ({ date: new Date(date), name }));
  }
}
