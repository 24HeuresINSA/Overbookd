import { IProvidePeriod, Period } from "@overbookd/time";
import {
  AlreadyAssigned,
  HasBreak,
  Unavailable,
  WrongTeam,
} from "../assignment.error.js";
import { retrieveImplicitTeams } from "../candidate-teams.js";
import { TeamMember } from "./assignment.js";

export type AssignableOnPeriodCheck = {
  teams: string[];
  availabilities: IProvidePeriod[];
  assignments: IProvidePeriod[];
  breakPeriods: IProvidePeriod[];
};

export function isAssignableOn(
  period: Period,
  { availabilities, assignments, breakPeriods }: AssignableOnPeriodCheck,
): boolean {
  return (
    hasAvailabilityCovering(period, availabilities) &&
    !hasOverlappingAssignment(period, assignments) &&
    !hasOverlappingBreak(period, breakPeriods)
  );
}

export function assertCanBeAssignedOn(
  { id, as }: TeamMember,
  { teams, availabilities, assignments, breakPeriods }: AssignableOnPeriodCheck,
  period: Period,
): void {
  const withImplicitTeams = retrieveImplicitTeams(teams);
  const memberOfTeam = withImplicitTeams.includes(as);
  if (!memberOfTeam) throw new WrongTeam(id, as);

  if (!hasAvailabilityCovering(period, availabilities)) {
    throw new Unavailable(id, period);
  }
  if (hasOverlappingAssignment(period, assignments)) {
    throw new AlreadyAssigned(id, period);
  }
  if (hasOverlappingBreak(period, breakPeriods)) {
    throw new HasBreak(id, period);
  }
}

function hasAvailabilityCovering(
  period: Period,
  availabilities: IProvidePeriod[],
): boolean {
  return availabilities.some((availability) =>
    Period.init(availability).includes(period),
  );
}

function hasOverlappingAssignment(
  period: Period,
  assignments: IProvidePeriod[],
): boolean {
  return assignments.some((assigned) =>
    Period.init(assigned).isOverlapping(period),
  );
}

function hasOverlappingBreak(
  period: Period,
  breakPeriods: IProvidePeriod[],
): boolean {
  return breakPeriods.some((breakPeriod) =>
    Period.init(breakPeriod).isOverlapping(period),
  );
}
