import { SELECT_PERIOD } from "./period.query";

export type DatabaseAssignment = {
  start: Date;
  end: Date;
  festivalTask: { name: string };
  assignees: { userId: number; teamCode: string }[];
  mobilization: {
    teams: { teamCode: string; count: number }[];
  };
};

export const SELECT_ASSIGNMENT = {
  ...SELECT_PERIOD,
  festivalTask: { select: { name: true } },
  assignees: { select: { userId: true, teamCode: true } },
  mobilization: {
    select: {
      teams: {
        select: { teamCode: true, count: true },
      },
    },
  },
};
