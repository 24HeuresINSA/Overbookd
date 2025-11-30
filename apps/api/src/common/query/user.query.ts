import { PERSONNE } from "@overbookd/team-constants";

export const SELECT_USER_IDENTIFIER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};
export const SELECT_USER_ASSIGNMENT_PREFERENCE = {
  preference: {
    select: {
      assignment: true,
    },
  },
};
export const IS_MEMBER_OF_VOLUNTEER_TEAM = {
  teams: { some: { team: { code: PERSONNE } } },
};

export const SELECT_TEAMS_CODE = {
  teams: { select: { teamCode: true } },
};
