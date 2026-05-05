import type { LocationQuery } from "vue-router";
import {
  AssignmentVolunteersFilterBuilder,
  type AssignmentVolunteersFilters,
} from "./assignment-volunteers.filter";

export type TaskOrgaFilters = AssignmentVolunteersFilters;

export class TaskOrgaFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): TaskOrgaFilters {
    const volunteersFilter =
      AssignmentVolunteersFilterBuilder.getFromRouteQuery(query);
    return { ...volunteersFilter };
  }
}
