import type { Availabilities } from "@overbookd/assignment";
import type { IProvidePeriod } from "@overbookd/period";
import { castPeriodsWithDate } from "~/utils/http/period";
import { isSuccess } from "~/utils/http/api-fetch";

export class AvailabilitiesRepository implements Availabilities {
  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res =
      await VolunteerAvailabilityRepository.getVolunteerAvailabilities(
        volunteer,
      );

    if (!isSuccess(res)) throw res;
    return castPeriodsWithDate(res);
  }
}
