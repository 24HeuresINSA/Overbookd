import { HttpStringified } from "../types/http";
import { Period } from "./period";
import { User } from "./user";

export interface VolunteerAvailability extends Period {}

export interface VolunteerWithAvailabilities extends User {
  availabilities: VolunteerAvailability[];
}

export function castAllVolunteerAvailabilitiesWithDate(
  volunteersWithAvailabilities: HttpStringified<VolunteerWithAvailabilities[]>
): VolunteerWithAvailabilities[] {
  return volunteersWithAvailabilities.map((volunteerWithAvailabilities) => ({
    ...volunteerWithAvailabilities,
    availabilities: castVolunteerAvailabilitiesWithDate(
      volunteerWithAvailabilities.availabilities
    ),
  }));
}

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
