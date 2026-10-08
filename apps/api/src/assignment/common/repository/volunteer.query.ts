import {
  SELECT_USER_ASSIGNMENT_PREFERENCE,
  SELECT_USER_WITH_TEAM_CODES,
} from "../../../common/query/user.query";
import { SELECT_USER_DATA_FOR_CHARISMA } from "../../../common/query/charisma.query";

export const SELECT_VOLUNTEER = {
  ...SELECT_USER_WITH_TEAM_CODES,
  ...SELECT_USER_ASSIGNMENT_PREFERENCE,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  comment: true,
  note: true,
  birthDate: true,
};
