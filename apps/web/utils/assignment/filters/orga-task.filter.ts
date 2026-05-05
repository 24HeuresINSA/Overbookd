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
    const selectedVolunteer = this.extractQueryParamsValue(
      query,
      SELECTED_VOLUNTEER_QUERY_PARAM,
    );

    return {
      ...volunteersFilter,
      ...selectedVolunteer,
    };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof OrgaTaskFilters,
  ): OrgaTaskFilters {
    switch (key) {
      case SELECTED_VOLUNTEER_QUERY_PARAM: {
        const selectedVolunteer = stringifyQueryParam(params.selectedVolunteer);
        if (!selectedVolunteer) return {};
        const selectedVolunteerId = Number(selectedVolunteer);
        if (isNaN(selectedVolunteerId)) return {};
        return { selectedVolunteer: selectedVolunteerId };
      }
      default:
        return {};
    }
  }
}
