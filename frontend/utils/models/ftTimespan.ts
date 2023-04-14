import { HttpStringified } from "../types/http";
import { User } from "./user";

export const TaskCategories = {
  STATIQUE: "STATIQUE",
  BAR: "BAR",
  MANUTENTION: "MANUTENTION",
  FUN: "FUN",
  RELOU: "RELOU",
  AUCUNE: "AUCUNE",
};

export type TaskCategory = keyof typeof TaskCategories;

export const TaskPriorities = {
  PRIORITAIRE: "PRIORITAIRE",
  NON_PRIORITAIRE: "NON PRIORITAIRE",
};

export type TaskPriority = keyof typeof TaskPriorities;

export interface FtTimespanParameters {
  hasPriority: boolean;
  category?: TaskCategory;
}

export interface SimplifiedFT extends FtTimespanParameters {
  id: number;
  name: string;
}

export interface RequestedTeam {
  code: string;
  quantity: number;
  assignmentCount: number;
}

export interface FtTimespan {
  id: number;
  start: Date;
  end: Date;
}

export interface FtTimespanWithRequestedTeams extends FtTimespan {
  requestedTeams: RequestedTeam[];
}

export interface FtTimespanEvent extends FtTimespan {
  name: string;
  color: string;
  timed: boolean;
}

export interface AvailableTimespan extends FtTimespanWithRequestedTeams {
  ft: SimplifiedFT;
  hasFriendsAssigned: boolean;
}

export interface TimespanAssignee extends User {
  assignedTeam: string;
  friends: User[];
}

export interface TimespanWithAssignees extends FtTimespanWithRequestedTeams {
  ft: {
    id: number;
    name: string;
    location: string;
  };
  requiredVolunteers: User[];
  assignees: TimespanAssignee[];
}

export interface FtWithTimespan extends SimplifiedFT {
  timespans: FtTimespanWithRequestedTeams[];
}

export function getRequiredTeamsInFt(ft: FtWithTimespan): string[] {
  const teams = ft.timespans.flatMap((timespan) =>
    timespan.requestedTeams.map((team) => team.code)
  );
  return [...new Set(teams)];
}

export function castAvailableTimespansWithDate(
  timespansWithFt: HttpStringified<AvailableTimespan[]>
): AvailableTimespan[] {
  return timespansWithFt.map((timespanWithFt) =>
    castAvailableTimespanWithDate(timespanWithFt)
  );
}

export function castAvailableTimespanWithDate(
  timespanWithFt: HttpStringified<AvailableTimespan>
): AvailableTimespan {
  return {
    ...timespanWithFt,
    start: new Date(timespanWithFt.start),
    end: new Date(timespanWithFt.end),
  };
}

export function castFtsWithTimespansWithDate(
  ftWithTimespans: HttpStringified<FtWithTimespan[]>
): FtWithTimespan[] {
  return ftWithTimespans.map((ftWithTimespan) =>
    castFtWithTimespansWithDate(ftWithTimespan)
  );
}

export function castFtWithTimespansWithDate(
  ftWithTimespan: HttpStringified<FtWithTimespan>
): FtWithTimespan {
  return {
    ...ftWithTimespan,
    timespans: ftWithTimespan.timespans.map((timespan) => ({
      ...timespan,
      start: new Date(timespan.start),
      end: new Date(timespan.end),
    })),
  };
}
