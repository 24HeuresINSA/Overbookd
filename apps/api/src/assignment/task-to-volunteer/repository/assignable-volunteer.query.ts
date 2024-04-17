import { Category, READY_TO_ASSIGN } from "@overbookd/festival-event-constants";

export type DatabaseStoredAssignableVolunteer = {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  charisma: number;
  comment: string;
  note: string;
  teams: { teamCode: string }[];
  assigned: {
    assignment: {
      start: Date;
      end: Date;
      festivalTask: { category: Category };
    };
  }[];
  festivalTaskMobilizations: {
    mobilization: {
      start: Date;
      end: Date;
      ft: { status: string };
    };
  }[];
  _count: {
    friends: number;
    friendRequestors: number;
  };
};

export const SELECT_VOLUNTEER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
  charisma: true,
  comment: true,
  note: true,
  teams: { select: { teamCode: true } },
};

export const SELECT_VOLUNTEER_MOBILIZATIONS = {
  festivalTaskMobilizations: {
    where: {
      mobilization: {
        ft: { status: { not: READY_TO_ASSIGN } },
      },
    },
    select: {
      mobilization: {
        select: {
          start: true,
          end: true,
        },
      },
    },
  },
} as const;
