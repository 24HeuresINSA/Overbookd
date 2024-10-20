import { WithAtLeastOneItem } from "@overbookd/list";
import { Volunteer } from "./instructions.js";
import { TimeWindow } from "../../common/time-window.js";
import { FestivalTask } from "../festival-task.js";

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
const teckos = "teckos";
const montage = "team-montage";

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
  teckos,
  montage,
] as const;
export const requirableTeamsExtended = [...requirableTeams, soft] as const;

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
