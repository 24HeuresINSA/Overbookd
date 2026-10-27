import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";
import type { User } from "@overbookd/user";
import {
  AssignmentVolunteersFilterBuilder,
  type AssignmentVolunteersFilters,
} from "./assignment-volunteers.filter";
import { SELECTED_VOLUNTEER_QUERY_PARAM } from "./assignment-filters.constant";

export type OrgaTaskFilters = AssignmentVolunteersFilters & {
  selectedVolunteer?: User["id"];
};

export class OrgaTaskFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): OrgaTaskFilters {
    const volunteersFilter =
      AssignmentVolunteersFilterBuilder.getFromRouteQuery(query);
    const selectedVolunteerId = stringifyQueryParam(
      query[SELECTED_VOLUNTEER_QUERY_PARAM],
    );
    const selectedVolunteer = selectedVolunteerId
      ? Number(selectedVolunteerId)
      : undefined;

    return {
      ...volunteersFilter,
      ...(selectedVolunteer !== undefined && !isNaN(selectedVolunteer)
        ? { selectedVolunteer }
        : {}),
    };
  }
}
