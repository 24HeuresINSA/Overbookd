import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/time";
import { DatabaseFriendCount } from "../../common/repository/friend.query";
import {
  SELECT_TEAMS_CODE,
  SELECT_USER_IDENTIFIER,
} from "../../../common/query/user.query";
import {
  SELECT_USER_DATA_FOR_CHARISMA,
  UserDataForCharisma,
} from "../../../common/query/charisma.query";
import { User } from "@overbookd/user";
import { AssignmentPreferenceType } from "@overbookd/preference";

type DatabaseFriend = {
  id: number;
  assigned: {
    assignment: IProvidePeriod & {
      festivalTaskId: number;
      mobilizationId: string;
      id: string;
    };
  }[];
};

export type DatabaseVolunteerAssignmentStat = IProvidePeriod & {
  festivalTask: { category: Category };
};

export type DatabaseStoredAssignableVolunteer = User &
  UserDataForCharisma &
  DatabaseFriendCount & {
    comment: string;
    note: string;
    teams: { teamCode: string }[];
    assigned: {
      assignment: DatabaseVolunteerAssignmentStat;
    }[];
    preference?: { assignment: AssignmentPreferenceType };
    festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
    friends: { requestor: DatabaseFriend }[];
    friendRequestors: { friend: DatabaseFriend }[];
  };

export const SELECT_VOLUNTEER = {
  ...SELECT_USER_IDENTIFIER,
  ...SELECT_USER_DATA_FOR_CHARISMA,
  ...SELECT_TEAMS_CODE,
  comment: true,
  note: true,
};
