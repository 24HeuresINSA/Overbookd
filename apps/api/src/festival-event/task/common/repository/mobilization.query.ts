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
  assignees: { select: { personalData: { select: SELECT_VOLUNTEER } } },
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

type DatabaseAssignee = {
  personalData: Volunteer;
};

export type DatabaseAssignment = {
  start: Date;
  end: Date;
  id: string;
  assignees: DatabaseAssignee[];
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
