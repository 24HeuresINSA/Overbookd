import { IProvidePeriod } from "@overbookd/period";
import { BENEVOLE_CODE } from "@overbookd/team";

export const IS_MEMBER_OF_VOLUNTEER_TEAM = {
  teams: {
    some: {
      team: { code: BENEVOLE_CODE },
    },
  },
};

export const IS_NOT_DELETED = { isDeleted: false };

const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  charisma: true,
  comment: true,
  note: true,
  teams: {
    select: {
      team: { select: { code: true } },
    },
  },
};

const SELECT_ASSIGNMENTS = {
  assigned: {
    select: {
      assignment: {
        select: {
          start: true,
          end: true,
        },
      },
    },
  },
};

export const SELECT_VOLUNTEER_WITH_ASSIGNMENTS = {
  ...SELECT_VOLUNTEER,
  ...SELECT_ASSIGNMENTS,
};

export type DatabaseAssigneeWithAssignments = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
  charisma: number;
  comment?: string;
  note?: string;
  teams: {
    team: {
      code: string;
    };
  }[];
  assigned: { assignment: IProvidePeriod }[];
};
