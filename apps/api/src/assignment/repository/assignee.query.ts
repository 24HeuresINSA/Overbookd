import { BENEVOLE_CODE } from "@overbookd/team";

export const HAS_VOLUNTEER_TEAM = {
  teams: {
    some: {
      team: { code: BENEVOLE_CODE },
    },
  },
};

export const IS_NOT_DELETED = { isDeleted: false };

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  charisma: true,
  comment: true,
  teams: {
    select: {
      team: { select: { code: true } },
    },
  },
};

export const SELECT_ASSIGNMENTS = {
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

export type DatabaseAssigneeWithAssignments = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
  comment?: string;
  teams: {
    team: {
      code: string;
    };
  }[];
  assigned: {
    assignment: {
      start: Date;
      end: Date;
    };
  }[];
};
