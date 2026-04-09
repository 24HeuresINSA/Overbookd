import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type { LocationQuery } from "vue-router";
import { stringifyQueryParam } from "~/utils/http/url-params.utils";

export class VolunteerSelectBuilder {
  static getFromRouteQuery(
    query: LocationQuery,
  ): VolunteerWithAssignmentDuration | undefined {
    const volunteerId = +stringifyQueryParam(query.volunteer);
    if (isNaN(volunteerId)) return undefined;
    const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
    const volunteer = assignVolunteerToTaskStore.volunteers.find(
      ({ id }) => id === volunteerId,
    );
    return volunteer;
  }
}
