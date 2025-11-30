import { WithAtLeastOneItem } from "@overbookd/list";
import {
  PERSONNE,
  CONFIANCE,
  VIEUX,
  CONDUCTEUR,
  BDE,
  KARNA,
  KFET,
  STRASBOURG,
  CVL,
  TECKOS,
  TEAM_MONTAGE,
  SOFT,
  HARD,
} from "@overbookd/team-constants";
import { Volunteer } from "./instructions.js";
import { TimeWindow } from "../../common/time-window.js";
import { FestivalTask } from "../festival-task.js";

export const requirableTeams = [
  PERSONNE,
  HARD,
  CONFIANCE,
  VIEUX,
  CONDUCTEUR,
  BDE,
  KARNA,
  KFET,
  STRASBOURG,
  CVL,
  TECKOS,
  TEAM_MONTAGE,
] as const;
export const requirableTeamsExtended = [...requirableTeams, SOFT] as const;

export type MobilizationOptions = {
  withConflicts: boolean;
  withAssignments: boolean;
};

const _defaultMobilizationOptions = {
  withConflicts: true,
  withAssignments: false,
} as const;

export type Conflicts = {
  tasks: FestivalTaskLink[];
  availability: boolean;
  assignments: FestivalTaskLink[];
};

export type VolunteerWithConflicts = Volunteer & { conflicts: Conflicts };

export type TeamMobilization = { count: number; team: string };

type MobilizationVolunteer<Options extends MobilizationOptions> =
  Options["withConflicts"] extends true ? VolunteerWithConflicts : Volunteer;

type BaseMobilization<Options extends MobilizationOptions> = TimeWindow & {
  volunteers:
    | MobilizationVolunteer<Options>[]
    | WithAtLeastOneItem<MobilizationVolunteer<Options>>;
  teams: TeamMobilization[] | WithAtLeastOneItem<TeamMobilization>;
  durationSplitInHour: null | number;
};

export type Assignment = TimeWindow & { assignees: Volunteer[] };

export type Mobilization<
  Options extends MobilizationOptions = typeof _defaultMobilizationOptions,
> = Options["withAssignments"] extends true
  ? BaseMobilization<Options> & {
      assignments: Assignment[];
    }
  : BaseMobilization<Options>;

export type AtLeastOneVolunteer<Options extends MobilizationOptions> = Omit<
  Mobilization<Options>,
  "volunteers"
> & {
  volunteers: WithAtLeastOneItem<MobilizationVolunteer<Options>>;
};

export type AtLeastOneTeam<Options extends MobilizationOptions> = Omit<
  Mobilization<Options>,
  "teams"
> & {
  teams: WithAtLeastOneItem<TeamMobilization>;
};

export type ReviewableMobilization<
  Options extends MobilizationOptions = typeof _defaultMobilizationOptions,
> = AtLeastOneTeam<Options> | AtLeastOneVolunteer<Options>;

export type FestivalTaskLink = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
};
