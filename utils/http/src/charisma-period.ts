import { IProvidePeriod } from "@overbookd/period";

export type CharismaPeriod = IProvidePeriod & {
  name: string;
  description: string;
  charisma: number;
};

export type SavedCharismaPeriod = CharismaPeriod & {
  id: number;
};
