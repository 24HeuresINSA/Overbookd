import { NotVolunteerPeriods } from "./not-volunteer-periods";
import { AvailabilitesAlert } from "./availabilities-alert";
import {
  NO_AVAILABILITIES,
  NOT_YET_VOLUNTEER,
} from "./availabilities-alerting.constant";

export class AvailabilitiesAlerting {
  constructor(private readonly notVolunteerPeriods: NotVolunteerPeriods) {}

  async for(volunteerID: number) {
    const nbPeriods = await this.notVolunteerPeriods.getNbPeriods(volunteerID);
    if (nbPeriods === 0)
      return new AvailabilitesAlert(NO_AVAILABILITIES, nbPeriods);
    if (nbPeriods > 0)
      return new AvailabilitesAlert(NOT_YET_VOLUNTEER, nbPeriods);
    return undefined;
  }
}
