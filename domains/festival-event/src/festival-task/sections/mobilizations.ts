import { Volunteer } from "./instructions";
import { TimeWindow } from "../../common/time-window";
import { FestivalTask } from "../festival-task";

type MobilizationOptions = { withConflicts: boolean };

export const defaultMobilizationOptions = { withConflicts: true } as const;

export type Conflicts = {
  tasks: FestivalTaskLink[];
  availability: boolean;
};

export type VolunteerWithConflicts = Volunteer & { conflicts: Conflicts };

export type VolunteerMobilization = Volunteer | VolunteerWithConflicts;

export type TeamMobilization = { count: number; team: string };

type MobilizationVolunteer<Options extends MobilizationOptions> =
  Options["withConflicts"] extends true ? VolunteerWithConflicts : Volunteer;

export type Mobilization<
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
> = TimeWindow & {
  volunteers: MobilizationVolunteer<Options>[];
  teams: TeamMobilization[];
  durationSplitInHour: null | number;
};

type AtLeastOneVolunteer<
  Options extends MobilizationOptions,
  V = MobilizationVolunteer<Options>,
> = Omit<Mobilization<Options>, "volunteers"> & {
  volunteers: [V, ...V[]];
};

type AtLeastOneTeam<Options extends MobilizationOptions> = Omit<
  Mobilization<Options>,
  "teams"
> & {
  teams: [TeamMobilization, ...TeamMobilization[]];
};

export type ReviewableMobilization<
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
> = AtLeastOneTeam<Options> | AtLeastOneVolunteer<Options>;

export type FestivalTaskLink = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
};
