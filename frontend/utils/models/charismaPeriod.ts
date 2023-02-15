import { HttpStringified } from "../types/http";
import { Period } from "./period";

export interface CharismaPeriod extends Period {
  name: string;
  description: string;
  charisma: number;
}

export interface SavedCharismaPeriod extends CharismaPeriod {
  id: number;
}

export function castCharismaPeriodsWithDate(
  charismaPeriods: HttpStringified<SavedCharismaPeriod[]>
): SavedCharismaPeriod[] {
  return charismaPeriods.map(castCharismaPeriodWithDate);
}

export function castCharismaPeriodWithDate(
  charismaPeriod: HttpStringified<SavedCharismaPeriod>
): SavedCharismaPeriod {
  return {
    ...charismaPeriod,
    start: new Date(charismaPeriod.start),
    end: new Date(charismaPeriod.end),
  };
}
