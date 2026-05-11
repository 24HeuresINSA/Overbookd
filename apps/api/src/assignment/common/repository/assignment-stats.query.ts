import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/time";
import { SELECT_PERIOD } from "../../../common/query/period.query";

export type DatabaseAssignmentWithTaskCategory = IProvidePeriod & {
  festivalTask: { category: Category };
};

export type DatabaseVolunteerAssignmentStatWithAssignees = IProvidePeriod & {
  festivalTask: { category: Category };
  assignees: {
    personalData: {
      friends: { requestorId: number }[];
      friendRequestors: { friendId: number }[];
    };
  }[];
};

export const SELECT_ASSIGNEE_FOR_FRIEND_STATS = {
  personalData: {
    select: {
      friends: { select: { requestorId: true } },
      friendRequestors: { select: { friendId: true } },
    },
  },
};

export const SELECT_PERIOD_AND_TASK_CATEGORY = {
  ...SELECT_PERIOD,
  festivalTask: { select: { category: true } },
};
