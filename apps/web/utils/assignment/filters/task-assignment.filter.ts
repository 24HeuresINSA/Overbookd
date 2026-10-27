import type { LocationQuery } from "vue-router";
import type { Team } from "@overbookd/team";
import {
  stringifyArrayQueryParam,
  stringifyQueryParam,
} from "~/utils/http/url-params.utils";
import {
  displayableCategories,
  type DisplayableCategory,
} from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";
import {
  COMPLETED_TASKS_QUERY_PARAM,
  HAS_ASSIGNED_FRIENDS_QUERY_PARAM,
  IN_CHARGE_TEAM_QUERY_PARAM,
  PAST_ASSIGNMENTS_QUERY_PARAM,
  REQUIRED_TEAMS_QUERY_PARAM,
  TASK_CATEGORY_QUERY_PARAM,
  TASK_SEARCH_QUERY_PARAM,
} from "./assignment-filters.constant";

export type TaskAssignmentFilters = {
  search?: string;
  requiredTeams?: Team[];
  inChargeTeam?: Team;
  category?: DisplayableCategory | TaskPriority;
  hasAssignedFriends?: boolean;
  past?: boolean;
  completed?: boolean;
};

export class TaskAssignmentFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): TaskAssignmentFilters {
    const teamStore = useTeamStore();
    const search = stringifyQueryParam(query[TASK_SEARCH_QUERY_PARAM]);
    const requiredTeams = stringifyArrayQueryParam(
      query[REQUIRED_TEAMS_QUERY_PARAM],
    )
      .map((teamCode) => teamStore.getTeamByCode(teamCode))
      .filter((team): team is Team => !!team);
    const inChargeTeamCode = stringifyQueryParam(
      query[IN_CHARGE_TEAM_QUERY_PARAM],
    );
    const inChargeTeam = teamStore.getTeamByCode(inChargeTeamCode);
    const category = stringifyQueryParam(query[TASK_CATEGORY_QUERY_PARAM]);

    return {
      ...(search ? { search } : {}),
      ...(requiredTeams.length ? { requiredTeams } : {}),
      ...(inChargeTeam ? { inChargeTeam } : {}),
      ...(isTaskCategory(category) ? { category } : {}),
      ...(isEnabled(query[HAS_ASSIGNED_FRIENDS_QUERY_PARAM])
        ? { hasAssignedFriends: true }
        : {}),
      ...(isEnabled(query[PAST_ASSIGNMENTS_QUERY_PARAM]) ? { past: true } : {}),
      ...(isEnabled(query[COMPLETED_TASKS_QUERY_PARAM])
        ? { completed: true }
        : {}),
    };
  }
}

function isTaskCategory(
  category: string,
): category is DisplayableCategory | TaskPriority {
  return (
    displayableCategories.some((candidate) => candidate === category) ||
    Object.values(TaskPriorities).some((priority) => priority === category)
  );
}

function isEnabled(value: LocationQuery[string]): boolean {
  return value === null || value === "true";
}
