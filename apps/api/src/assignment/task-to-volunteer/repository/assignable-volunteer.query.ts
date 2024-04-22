import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";
import { DatabaseFriendCount } from "../../common/repository/friend.query";

type DatabaseFriend = {
  id: number;
  availabilities: IProvidePeriod[];
  assigned: {
    assignment: IProvidePeriod & { festivalTaskId: number };
  }[];
};

export type DatabaseStoredAssignableVolunteer = DatabaseFriendCount & {
  id: number;
  firstname: string;
  lastname: string;
  nickname: string;
  charisma: number;
  comment: string;
  note: string;
  teams: { teamCode: string }[];
  assigned: {
    assignment: IProvidePeriod & { festivalTask: { category: Category } };
  }[];
  festivalTaskMobilizations: { mobilization: IProvidePeriod }[];
  friends: { requestor: DatabaseFriend }[];
  friendRequestors: { friend: DatabaseFriend }[];
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
