import { BENEVOLE_CODE } from "@overbookd/team-constants";

export const SELECT_USER_IDENTIFIER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export const IS_MEMBER_OF_VOLUNTEER_TEAM = {
  teams: { some: { team: { code: BENEVOLE_CODE } } },
};
