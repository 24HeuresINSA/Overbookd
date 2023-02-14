import { Period } from "./period";

export interface CharismaPeriod {
  name: string;
  description: string;
  period: Period;
  charisma: number;
}

export interface SavedCharismaPeriod extends CharismaPeriod {
  id: number;
}

export interface CharismaPeriodCreation extends Omit<CharismaPeriod, "period"> {
  start: Date;
  end: Date;
}

export interface CharismaPeriodUpdate extends CharismaPeriodCreation {
  id: number;
}

export function toCharismaPeriodCreation(
  charismaPeriod: CharismaPeriod
): CharismaPeriodCreation {
  return {
    name: charismaPeriod.name,
    description: charismaPeriod.description,
    start: charismaPeriod.period.start,
    end: charismaPeriod.period.end,
    charisma: charismaPeriod.charisma,
  };
}

export function toCharismaPeriodUpdate(
  charismaPeriod: SavedCharismaPeriod
): CharismaPeriodUpdate {
  return {
    ...toCharismaPeriodCreation(charismaPeriod),
    id: charismaPeriod.id,
  };
}
