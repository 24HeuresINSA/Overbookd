import {
  SELECT_USER_ASSIGNMENT_PREFERENCE,
  SELECT_USER_WITH_TEAM_CODES,
} from "../../../common/query/user.query";
import {
  SELECT_USER_DATA_FOR_CHARISMA,
  UserDataForCharisma,
} from "../../../common/query/charisma.query";
import { AssignmentPreferenceType } from "@overbookd/preference";
import { User } from "@overbookd/user";

export const SELECT_VOLUNTEER = {
  ...SELECT_USER_WITH_TEAM_CODES,
  ...SELECT_USER_ASSIGNMENT_PREFERENCE,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  comment: true,
  note: true,
  birthDate: true,
};

export type DatabaseVolunteer = User &
  UserDataForCharisma & {
    comment?: string;
    note?: string;
    birthDate: Date;
    teams: { teamCode: string }[];
    preference: { assignment: AssignmentPreferenceType };
  };
