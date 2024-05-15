import { Category } from "@overbookd/festival-event-constants";
import { IProvidePeriod } from "@overbookd/period";

export type DatabaseVolunteerAssignmentStat = IProvidePeriod & {
  festivalTask: { category: Category };
};
