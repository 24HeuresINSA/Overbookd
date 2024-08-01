import { IProvidePeriod } from "@overbookd/period";
import { SELECT_PERIOD } from "./period.query";

const SELECT_CHARISMA = { charisma: true };

export const SELECT_USER_DATA_FOR_CHARISMA = {
  charismaEventParticipations: { select: SELECT_CHARISMA },
  availabilities: { select: SELECT_PERIOD },
};

export type UserDataForCharisma = {
  charismaEventParticipations: { charisma: number }[];
  availabilities: IProvidePeriod[];
};

export const SELECT_CHARISMA_PERIOD = {
  ...SELECT_PERIOD,
  ...SELECT_CHARISMA,
};

export type MinimalCharismaPeriod = IProvidePeriod & {
  charisma: number;
};
