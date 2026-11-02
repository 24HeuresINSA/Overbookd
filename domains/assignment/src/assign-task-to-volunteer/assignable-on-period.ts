import { IProvidePeriod, Period } from "@overbookd/time";
import {
  AlreadyAssigned,
  HasBreak,
  Unavailable,
  WrongTeam,
} from "../assignment.error.js";
import { retrieveImplicitTeams } from "../candidate-teams.js";
import { TeamMember } from "./assignment.js";

type AssignableOnPeriodCheck = {
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
    hasIncludedPeriod(period, availabilities) &&
    !hasOverlappingPeriod(period, assignments) &&
    !hasOverlappingPeriod(period, breakPeriods)
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

  if (!hasIncludedPeriod(period, availabilities)) {
    throw new Unavailable(id, period);
  }
  if (hasOverlappingPeriod(period, assignments)) {
    throw new AlreadyAssigned(id, period);
  }
  if (hasOverlappingPeriod(period, breakPeriods)) {
    throw new HasBreak(id, period);
  }
}

function hasIncludedPeriod(period: Period, periods: IProvidePeriod[]): boolean {
  return periods.some((p) => Period.init(p).includes(period));
}

function hasOverlappingPeriod(
  period: Period,
  periods: IProvidePeriod[],
): boolean {
  return periods.some((p) => Period.init(p).isOverlapping(period));
}
