import { HttpStringified } from "../types/http";

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

interface SimplifiedFT extends FtTimespanParameters {
  id: number;
  name: string;
}

interface RequestedTeam {
  code: string;
  quantity: number;
  assignmentCount: number;
}

export interface FtTimespan {
  id: number;
  start: Date;
  end: Date;
}

export interface FtTimespanEvent extends FtTimespan {
  name: string;
  color: string;
  timed: boolean;
}

export interface TimespanWithFt extends FtTimespan {
  ft: SimplifiedFT;
}

export interface FtWithTeamRequests extends SimplifiedFT {
  teamRequests: RequestedTeam[];
}

export interface TimespansWithStats extends FtTimespan {
  teamRequest: RequestedTeam;
}

export function castTimespansWithFtWithDate(
  timespansWithFt: HttpStringified<TimespanWithFt[]>
): TimespanWithFt[] {
  return timespansWithFt.map((timespanWithFt) =>
    castTimespanWithFtWithDate(timespanWithFt)
  );
}

export function castTimespanWithFtWithDate(
  timespanWithFt: HttpStringified<TimespanWithFt>
): TimespanWithFt {
  return {
    ...timespanWithFt,
    start: new Date(timespanWithFt.start),
    end: new Date(timespanWithFt.end),
  };
}
