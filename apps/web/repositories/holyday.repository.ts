import { isDateString } from "@overbookd/period";
import { HolyDay } from "~/store/holyday";

type GouvHolyDay = {
  [date: string]: string;
};

export class HolydayRepository {
  static async fetchGouvHollyDays(): Promise<HolyDay[]> {
    const path = "https://calendrier.api.gouv.fr/jours-feries/metropole.json";

    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(
        "❌ Impossible de récupérer les jours fériés de gouv.fr.",
      );
    }
    const data: GouvHolyDay = await response.json();

    return Object.entries(data)
      .filter(([date]) => isDateString(date))
      .map(([date, name]) => ({ date: new Date(date), name }));
  }
}
