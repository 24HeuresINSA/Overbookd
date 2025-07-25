import type { HttpStringified, MultiPlanningVolunteer } from "@overbookd/http";
import {
  castPeriodWithDate,
  castPeriodsWithDate,
} from "~/utils/http/cast-date/period.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import { MultiPlanningRepository } from "~/repositories/multi-planning.repository";

type State = {
  volunteers: MultiPlanningVolunteer[];
};

export const useMultiPlanningStore = defineStore("multi-planning", {
  state: (): State => ({
    volunteers: [],
  }),
  actions: {
    async fetchVolunteers(volunteerIds: number[]) {
      const res = await MultiPlanningRepository.getVolunteers(volunteerIds);
      if (isHttpError(res)) return;
      this.volunteers = res.map(castVolunteerWithDate);
    },
  },
});

function castVolunteerWithDate(
  volunteer: HttpStringified<MultiPlanningVolunteer>,
): MultiPlanningVolunteer {
  return {
    ...volunteer,
    availabilities: castPeriodsWithDate(volunteer.availabilities),
    assignments: volunteer.assignments.map((assignment) => ({
      ...assignment,
      ...castPeriodWithDate(assignment),
    })),
  };
}
