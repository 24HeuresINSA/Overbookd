import {
  FestivalTaskOptions,
  defaultFestivalTaskOptions,
} from "../festival-task";
import { Volunteer } from "./instructions";
import { TimeWindow } from "../../common/time-window";
import { FestivalTask } from "../festival-task";

type MobilizationOptions = FestivalTaskOptions;

const defaultMobilizationOptions = defaultFestivalTaskOptions;

type Conflicts = {
  tasks: FestivalTaskLink[];
};

export type VolunteerWithConflicts = Volunteer & { conflicts: Conflicts };

export type VolunteerMobilization = Volunteer | VolunteerWithConflicts;

export type TeamMobilization = { count: number; team: string };

export type DraftMobilization<
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
> = TimeWindow & {
  volunteers: Options["withConflicts"] extends true
    ? VolunteerWithConflicts[]
    : Volunteer[];
  teams: TeamMobilization[];
  durationSplitInHour: null | number;
};

type AtLeastOneVolunteer<Options extends MobilizationOptions> = {
  volunteers: Options["withConflicts"] extends true
    ? [VolunteerWithConflicts, ...VolunteerWithConflicts[]]
    : [Volunteer, ...Volunteer[]];
  teams: TeamMobilization[];
};

type AtLeastOneTeam<Options extends MobilizationOptions> = {
  volunteers: Options["withConflicts"] extends true
    ? VolunteerWithConflicts
    : Volunteer[];
  teams: [TeamMobilization, ...TeamMobilization[]];
};

export type Mobilization<
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
> = TimeWindow &
  (AtLeastOneVolunteer<Options> | AtLeastOneTeam<Options>) & {
    durationSplitInHour: null | number;
  };

export type FestivalTaskLink = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
};
