import { isDateString, OverDate, type DateString } from "@overbookd/time";

type FrenchGouvPublicHoliday = {
  [date: string]: string;
};

export class FrenchGovPublicHolidayRepository {
  static async all(): Promise<PublicHoliday[]> {
    const path = "https://calendrier.api.gouv.fr/jours-feries/metropole.json";

    const response = await fetch(path);
    if (!response.ok) return [];
    const data: FrenchGouvPublicHoliday = await response.json();

    return Object.entries(data)
      .filter(([date]) => isDateString(date))
      .map(([date, name]) => ({
        date: OverDate.init({ date: date as DateString, hour: 0 }).date,
        name,
      }));
  }
}
