import { WithAtLeastOneItem } from "@overbookd/list";
import { Volunteer } from "./instructions";
import { TimeWindow } from "../../common/time-window";
import { FestivalTask } from "../festival-task";

const benevole = "benevole";
const hard = "hard";
const confiance = "confiance";
const vieux = "vieux";
const conducteur = "conducteur";
const bde = "bde";
const karna = "karna";
const kfet = "kfet";
const strasbourg = "strasbourg";
const soft = "soft";
const cvl = "cvl";

export const requirableTeams = [
  benevole,
  hard,
  confiance,
  vieux,
  conducteur,
  bde,
  karna,
  kfet,
  strasbourg,
  cvl,
] as const;
export const requirableTeamsExtended = [...requirableTeams, soft] as const;

export type MobilizationOptions = {
  withConflicts: boolean;
  withAssignments: boolean;
};

const defaultMobilizationOptions = {
  withConflicts: true,
  withAssignments: false,
} as const;

export type Conflicts = {
  tasks: FestivalTaskLink[];
  availability: boolean;
};

export type VolunteerWithConflicts = Volunteer & { conflicts: Conflicts };

export type TeamMobilization = { count: number; team: string };

type MobilizationVolunteer<Options extends MobilizationOptions> =
  Options["withConflicts"] extends true ? VolunteerWithConflicts : Volunteer;

type BaseMobilization<Options extends MobilizationOptions> = TimeWindow & {
  volunteers: MobilizationVolunteer<Options>[];
  teams: TeamMobilization[];
  durationSplitInHour: null | number;
};

export type Assignment = TimeWindow & { assignees: Volunteer[] };

export type Mobilization<
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
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
  Options extends MobilizationOptions = typeof defaultMobilizationOptions,
> = AtLeastOneTeam<Options> | AtLeastOneVolunteer<Options>;

export type FestivalTaskLink = {
  id: FestivalTask["id"];
  name: FestivalTask["general"]["name"];
};
