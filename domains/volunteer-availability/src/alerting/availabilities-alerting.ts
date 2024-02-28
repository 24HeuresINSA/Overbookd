import { AvailabilitiesForAlert } from "./availabilities-for-alert";
import { AvailabilitesAlert } from "./availabilities-alert";
import {
  NO_AVAILABILITIES,
  NOT_YET_VOLUNTEER,
} from "./availabilities-alerting.constant";

export class AvailabilitiesAlerting {
  constructor(private readonly availabilities: AvailabilitiesForAlert) {}

  async for(volunteerID: number) {
    const availabilitiesCount =
      await this.availabilities.getCountFor(volunteerID);
    if (availabilitiesCount === 0)
      return new AvailabilitesAlert(NO_AVAILABILITIES, availabilitiesCount);
    if (availabilitiesCount > 0)
      return new AvailabilitesAlert(NOT_YET_VOLUNTEER, availabilitiesCount);
    return undefined;
  }
}
