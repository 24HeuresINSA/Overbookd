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

// TODO: should need more test with period have parts of it in several charismaPeriod
export function getPeriodCharisma(
  charismaPeriods: SavedCharismaPeriod[],
  period: Period,
): number {
  const charismaPeriod = charismaPeriods.find((charismaPeriod) =>
    Period.init(charismaPeriod).includes(period),
  );
  const charisma = charismaPeriod?.charisma ?? 0;

  return period.duration.inHours * charisma;
}
