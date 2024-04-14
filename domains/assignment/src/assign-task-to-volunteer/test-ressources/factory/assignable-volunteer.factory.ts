import { Period } from "@overbookd/period";
import { Volunteer } from "../../../volunteer";
import {
  AssignableVolunteer,
  StoredAssignableVolunteer,
} from "../../assignable-volunteer";

export class AssignableVolunteerFactory {
  private constructor(
    readonly stored: StoredAssignableVolunteer,
    readonly expected: AssignableVolunteer,
  ) {}

  static init(volunteer: Volunteer): AssignableVolunteerFactory {
    const stored: StoredAssignableVolunteer = {
      ...volunteer,
      hasFriendAssigned: false,
      hasFriendAvailable: false,
      requestedDuring: [],
      assignments: [],
    };
    const expected: AssignableVolunteer = {
      ...volunteer,
      assignmentDuration: 0,
      isRequestedOnSamePeriod: false,
      hasFriendAssigned: false,
      hasFriendAvailable: false,
    };

    return new AssignableVolunteerFactory(stored, expected);
  }

  withAssignments(
    periods: Period[],
    duration: number,
  ): AssignableVolunteerFactory {
    return new AssignableVolunteerFactory(
      { ...this.stored, assignments: periods },
      { ...this.expected, assignmentDuration: duration },
    );
  }

  withRequests(
    periods: Period[],
    isRequestedOnSamePeriod: boolean,
  ): AssignableVolunteerFactory {
    return new AssignableVolunteerFactory(
      { ...this.stored, requestedDuring: periods },
      { ...this.expected, isRequestedOnSamePeriod },
    );
  }
}
