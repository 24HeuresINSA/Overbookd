import { Volunteer } from "@overbookd/festival-event";
import { SELECT_VOLUNTEER } from "../../../common/repository/volunteer.query";

const SELECT_TEAM = {
  count: true,
  teamCode: true,
};

export const SELECT_MOBILIZATION = {
  id: true,
  start: true,
  end: true,
  volunteers: { select: { volunteer: { select: SELECT_VOLUNTEER } } },
  teams: { select: SELECT_TEAM },
  durationSplitInHour: true,
};

type DatabaseTeam = {
  count: number;
  teamCode: string;
};

export type DatabaseMobilization = {
  id: string;
  start: Date;
  end: Date;
  volunteers: { volunteer: Volunteer }[];
  teams: DatabaseTeam[];
  durationSplitInHour: null | number;
};
