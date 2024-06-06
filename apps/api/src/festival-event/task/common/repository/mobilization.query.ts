import { Volunteer } from "@overbookd/festival-event";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";
import { SELECT_PERIOD_WITH_ID } from "../../../../common/query/period.query";

const SELECT_TEAM = {
  count: true,
  teamCode: true,
};

export const SELECT_MOBILIZATION = {
  ...SELECT_PERIOD_WITH_ID,
  volunteers: { select: { volunteer: { select: SELECT_VOLUNTEER } } },
  teams: { select: SELECT_TEAM },
  durationSplitInHour: true,
  assignments: { select: SELECT_PERIOD_WITH_ID },
};

type DatabaseTeam = {
  count: number;
  teamCode: string;
};

export type DatabaseAssignment = {
  start: Date;
  end: Date;
  id: string;
};

export type DatabaseMobilization = {
  id: string;
  start: Date;
  end: Date;
  volunteers: { volunteer: Volunteer }[];
  teams: DatabaseTeam[];
  durationSplitInHour: null | number;
  assignments: DatabaseAssignment[];
};
