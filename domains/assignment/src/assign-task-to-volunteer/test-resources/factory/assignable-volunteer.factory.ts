import { Period } from "@overbookd/period";
import { FormatVolunteer, Volunteer } from "../../../volunteer.js";
import {
  AssignableVolunteer,
  StoredAssignableVolunteer,
  StoredAssignment,
} from "../../assignable-volunteer.js";
import {
  BAR,
  Category,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";

export type MaybeCategory = Category | "undefined";

export class AssignableVolunteerFactory {
  private constructor(
    readonly stored: StoredAssignableVolunteer,
    readonly expected: Record<MaybeCategory, AssignableVolunteer>,
  ) {}

  static init(volunteer: Volunteer): AssignableVolunteerFactory {
    const stored: StoredAssignableVolunteer = {
      ...volunteer,
      hasFriendAssigned: false,
      assignableFriendsIds: [],
      hasAtLeastOneFriend: false,
      requestedDuring: [],
      assignments: [],
    };
    const assignable: AssignableVolunteer = {
      ...volunteer,
      assignmentDuration: 0,
      totalAssignmentDuration: 0,
      isRequestedOnSamePeriod: false,
      hasFriendAssigned: false,
      assignableFriendsIds: [],
      hasAtLeastOneFriend: false,
    };
    const expected: Record<MaybeCategory, AssignableVolunteer> = {
      [BAR]: assignable,
      [STATIQUE]: assignable,
      [FUN]: assignable,
      [MANUTENTION]: assignable,
      [RELOU]: assignable,
      ["undefined"]: assignable,
    };

    return new AssignableVolunteerFactory(stored, expected);
  }

  withAssignments(
    assignments: StoredAssignment[],
    duration: Record<MaybeCategory, number>,
  ): AssignableVolunteerFactory {
    const expected = {
      [BAR]: {
        ...this.expected.BAR,
        assignmentDuration: duration.BAR,
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
      [STATIQUE]: {
        ...this.expected.STATIQUE,
        assignmentDuration: duration.STATIQUE,
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
      [FUN]: {
        ...this.expected.FUN,
        assignmentDuration: duration.FUN,
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
      [MANUTENTION]: {
        ...this.expected.MANUTENTION,
        assignmentDuration: duration.MANUTENTION,
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
      [RELOU]: {
        ...this.expected.RELOU,
        assignmentDuration: duration.RELOU,
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
      ["undefined"]: {
        ...this.expected["undefined"],
        assignmentDuration: duration["undefined"],
        totalAssignmentDuration: FormatVolunteer.computeAssignmentDuration(
          assignments.map((period) => Period.init(period)),
        ),
      },
    };
    return new AssignableVolunteerFactory(
      { ...this.stored, assignments },
      expected,
    );
  }

  withRequests(
    periods: Period[],
    isRequestedOnSamePeriod: boolean,
  ): AssignableVolunteerFactory {
    const expected = {
      [BAR]: { ...this.expected.BAR, isRequestedOnSamePeriod },
      [STATIQUE]: { ...this.expected.STATIQUE, isRequestedOnSamePeriod },
      [FUN]: { ...this.expected.FUN, isRequestedOnSamePeriod },
      [MANUTENTION]: { ...this.expected.MANUTENTION, isRequestedOnSamePeriod },
      [RELOU]: { ...this.expected.RELOU, isRequestedOnSamePeriod },
      ["undefined"]: { ...this.expected["undefined"], isRequestedOnSamePeriod },
    };
    return new AssignableVolunteerFactory(
      { ...this.stored, requestedDuring: periods },
      expected,
    );
  }
}
