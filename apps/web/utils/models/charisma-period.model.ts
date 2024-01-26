import { IProvidePeriod, Period } from "@overbookd/period";
import { HttpStringified } from "@overbookd/http";

export interface CharismaPeriod extends IProvidePeriod {
  name: string;
  description: string;
  charisma: number;
}

export interface SavedCharismaPeriod extends CharismaPeriod {
  id: number;
}

export function castCharismaPeriodsWithDate(
  charismaPeriods: HttpStringified<SavedCharismaPeriod[]>,
): SavedCharismaPeriod[] {
  return charismaPeriods.map(castCharismaPeriodWithDate);
}

export function castCharismaPeriodWithDate(
  charismaPeriod: HttpStringified<SavedCharismaPeriod>,
): SavedCharismaPeriod {
  return {
    ...charismaPeriod,
    start: new Date(charismaPeriod.start),
    end: new Date(charismaPeriod.end),
  };
}

export function getCharismaByDate(
  charismaPeriods: SavedCharismaPeriod[],
  date: Date,
): number {
  return (
    charismaPeriods.find((charismaPeriod) => {
      const period = Period.init(charismaPeriod);
      return period.isIncluding(date);
    })?.charisma ?? 0
  );
}
