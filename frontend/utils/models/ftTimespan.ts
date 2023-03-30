import { HttpStringified } from "../types/http";

export enum FtTimespanCategory {
  STATIQUE = "STATIQUE",
  BAR = "BAR",
  MANUTENTION = "MANUTENTION",
  FUN = "FUN",
  RELOU = "RELOU",
  AUCUNE = "AUCUNE",
}

export interface FtTimespanParameters {
  hasPriority: boolean;
  category?: FtTimespanCategory;
}

interface SimplifiedFT extends FtTimespanParameters {
  id: number;
  name: string;
}

interface RequestedTeam {
  code: string;
  quantity: number;
}

interface FtTimespan {
  id: number;
  start: Date;
  end: Date;
  requestedTeams: RequestedTeam[];
}

export interface TimespanWithFt extends FtTimespan {
  ft: SimplifiedFT;
}

export interface FtWithTimespan extends SimplifiedFT {
  timespans: FtTimespan[];
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

export function castFtWithTimespansWithDate(
  ftWithTimespans: HttpStringified<FtWithTimespan[]>
): FtWithTimespan[] {
  return ftWithTimespans.map((ftWithTimespan) =>
    castFtWithTimespanWithDate(ftWithTimespan)
  );
}

export function castFtWithTimespanWithDate(
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
