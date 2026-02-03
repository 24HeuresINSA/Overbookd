import { IProvidePeriod } from "@overbookd/time";

export type CharismaPeriod = IProvidePeriod & {
  name: string;
  charisma: number;
};

export type SavedCharismaPeriod = CharismaPeriod & {
  id: number;
};
