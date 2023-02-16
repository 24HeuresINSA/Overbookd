import { HttpStringified } from "../types/http";
import { Period } from "./period";

export interface VolunteerAvailability extends Period {}

export function castVolunteerAvailabilitiesWithDate(
  volunteerAvailabilities: HttpStringified<VolunteerAvailability>[]
): VolunteerAvailability[] {
  return volunteerAvailabilities.map(castVolunteerAvailabilityWithDate);
}

function castVolunteerAvailabilityWithDate(
  volunteerAvailability: HttpStringified<VolunteerAvailability>
): VolunteerAvailability {
  return {
    ...volunteerAvailability,
    start: new Date(volunteerAvailability.start),
    end: new Date(volunteerAvailability.end),
  };
}
