import type { Category } from "@overbookd/festival-event-constants";
import type { Team } from "@overbookd/team";
import type { DisplayableCategory } from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TaskAssignmentFilters } from "./task-assignment.filter";

export type FilterableTask = Searchable<{
  teams: string[];
  inChargeTeam: string;
  category?: Category | null;
  topPriority: boolean;
  end: Date;
  hasFriendsAssigned?: boolean;
}>;

type TaskMatcher = (task: FilterableTask) => boolean;

export function matchTaskAssignmentFilters(
  filters: TaskAssignmentFilters,
): TaskMatcher {
  const matchers: TaskMatcher[] = [
    matchPast(filters.past ?? false),
    keepMatchingSearchCriteria(filters.search ?? ""),
    matchRequiredTeams(filters.requiredTeams ?? []),
    matchInChargeTeam(filters.inChargeTeam),
    matchCategoryOrPriority(filters.category),
    matchHasAssignedFriends(filters.hasAssignedFriends ?? false),
  ];
  return (task) => matchers.every((match) => match(task));
}

function matchPast(showPast: boolean): TaskMatcher {
  return ({ end }) => showPast || end > new Date();
}

function matchRequiredTeams(requiredTeams: Team[]): TaskMatcher {
  if (requiredTeams.length === 0) return () => true;
  return ({ teams }) => requiredTeams.every(({ code }) => teams.includes(code));
}

function matchInChargeTeam(inChargeTeam?: Team): TaskMatcher {
  if (!inChargeTeam?.code) return () => true;
  return (task) => task.inChargeTeam === inChargeTeam.code;
}

function matchCategoryOrPriority(
  category?: DisplayableCategory | TaskPriority,
): TaskMatcher {
  if (!category) return () => true;
  return isTaskPriority(category)
    ? matchPriority(category)
    : matchCategory(category);
}

function isTaskPriority(
  category: DisplayableCategory | TaskPriority,
): category is TaskPriority {
  return Object.values(TaskPriorities).includes(category);
}

function matchPriority(priority: TaskPriority): TaskMatcher {
  const hasPriority = priority === TaskPriorities.PRIORITAIRE;
  return ({ topPriority }) => topPriority === hasPriority;
}

function matchCategory(category: DisplayableCategory): TaskMatcher {
  if (category === "AUCUNE") return (task) => !task.category;
  return (task) => task.category === category;
}

function matchHasAssignedFriends(hasAssignedFriends: boolean): TaskMatcher {
  if (!hasAssignedFriends) return () => true;
  return (task) => task.hasFriendsAssigned === true;
}
