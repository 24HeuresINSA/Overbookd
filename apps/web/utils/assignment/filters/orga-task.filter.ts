import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";
import type { User } from "@overbookd/user";
import { SELECTED_VOLUNTEER_QUERY_PARAM } from "./assignment-filters.constant";

export function getSelectedVolunteerFromRouteQuery(
  query: LocationQuery,
): User["id"] | undefined {
  const selectedVolunteerId = stringifyQueryParam(
    query[SELECTED_VOLUNTEER_QUERY_PARAM],
  );
  if (!selectedVolunteerId) return undefined;
  const selectedVolunteer = Number(selectedVolunteerId);
  return isNaN(selectedVolunteer) ? undefined : selectedVolunteer;
}
