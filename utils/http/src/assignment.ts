import type {
  TaskCategorizedForPlanning,
  AssignmentSummary,
  FriendCount,
} from "@overbookd/assignment";
import type { Category } from "@overbookd/festival-event-constants";

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

export type VolunteerWithAssignmentStats = {
  id: number;
  firstname: string;
  lastname: string;
  charisma: number;
} & AssignmentStats;
