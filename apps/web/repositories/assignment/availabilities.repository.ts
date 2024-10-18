import type { Availabilities } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/time";
import { castPeriodsWithDate } from "~/utils/http/cast-date/period.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import { VolunteerAvailabilityRepository } from "../volunteer-availability.repository";

export class AvailabilitiesRepository implements Availabilities {
  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res =
      await VolunteerAvailabilityRepository.getVolunteerAvailabilities(
        volunteer,
      );

    if (isHttpError(res)) throw res;
    return castPeriodsWithDate(res);
  }
}
