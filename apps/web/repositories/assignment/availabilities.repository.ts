import { Context } from "../context";
import { HttpStringified } from "@overbookd/http";
import { Availabilities } from "@overbookd/assignment";
import { IProvidePeriod } from "@overbookd/period";
import { castPeriodWithDate } from "~/utils/http/period";
import { VolunteerAvailabilityRepository } from "../volunteer-availability.repository";

export class AvailabilitiesRepository implements Availabilities {
  constructor(private readonly context: Context) {}

  async for(volunteer: number): Promise<IProvidePeriod[]> {
    const res =
      await VolunteerAvailabilityRepository.getVolunteerAvailabilities(
        this.context,
        volunteer,
      );

    return castWithDate(res.data);
  }
}

function castWithDate(
  availabilities: HttpStringified<IProvidePeriod[]>,
): IProvidePeriod[] {
  return availabilities.map(castPeriodWithDate);
}
