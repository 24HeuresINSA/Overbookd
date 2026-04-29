import type {
  TaskCategorizedForPlanning,
  AssignmentSummary,
  FriendCount,
} from "@overbookd/assignment";
import type { Category } from "@overbookd/festival-event-constants";
import { User } from "@overbookd/user";

export type AssignmentSummaryWithTask = AssignmentSummary & {
  task: TaskCategorizedForPlanning;
};

export type AssignmentStat = {
  category: Category;
  duration: number;
};

export type AssignmentStats = {
  stats: AssignmentStat[];
  withFriendsAssignmentDuration: number;
  friendCount: FriendCount;
};

export type VolunteerWithAssignmentStats = User & {
  charisma: number;
} & AssignmentStats;

export type AssignmentFriend = User & { isDirectFriend: boolean };
