import { Volunteer } from "@overbookd/festival-event";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

const SELECT_TEAM = {
  count: true,
  teamCode: true,
};

const SELECT_ASSIGNMENT = {
  id: true,
  start: true,
  end: true,
};

export const SELECT_MOBILIZATION = {
  id: true,
  start: true,
  end: true,
  volunteers: { select: { volunteer: { select: SELECT_VOLUNTEER } } },
  teams: { select: SELECT_TEAM },
  durationSplitInHour: true,
  assignments: { select: SELECT_ASSIGNMENT },
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
