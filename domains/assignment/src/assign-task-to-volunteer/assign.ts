import { IProvidePeriod, Period } from "@overbookd/time";
import {
  AlreadyAssigned,
  HasBreak,
  Unavailable,
  WrongTeam,
} from "../assignment.error.js";
import {
  VolunteerWithAssignments,
  Volunteers,
} from "../assign-volunteer-to-task/assign-volunteer-to-task.js";
import { retrieveImplicitTeams } from "../candidate-teams.js";
import { BreakPeriod } from "../break-periods/break-periods.js";
import { Assignment, TeamMember } from "./assignment.js";
import { Availabilities, BreakPeriods } from "./funnel/planning.js";
import {
  Assignments,
  VolunteersForAssignment,
} from "./repositories/assignments.js";

export class Assign {
  constructor(
    private readonly assignments: Assignments,
    private readonly allVolunteers: Volunteers,
    private readonly availabilities: Availabilities,
    private readonly breakPeriods: BreakPeriods,
  ) {}

  async volunteers({
    assignment: identifier,
    volunteers,
  }: VolunteersForAssignment): Promise<Assignment> {
    const assignment = await this.assignments.findOne(identifier);
    const period = Period.init(assignment);

    for (const volunteer of volunteers) {
      const [withAssignments, availabilities, breakPeriods] = await Promise.all(
        [
          this.allVolunteers.findOne(volunteer.id),
          this.availabilities.for(volunteer.id),
          this.breakPeriods.for(volunteer.id),
        ],
      );
      this.assertCanBeAssigned(
        volunteer,
        withAssignments,
        availabilities,
        breakPeriods,
        period,
      );
    }

    return this.assignments.assign({ assignment: identifier, volunteers });
  }

  private assertCanBeAssigned(
    { id, as }: TeamMember,
    { teams, assignments }: VolunteerWithAssignments,
    availabilities: IProvidePeriod[],
    breakPeriods: BreakPeriod[],
    period: Period,
  ): void {
    const withImplicitTeams = retrieveImplicitTeams(teams);
    const memberOfTeam = withImplicitTeams.includes(as);
    if (!memberOfTeam) throw new WrongTeam(id, as);

    const isAvailable = availabilities.some((availability) =>
      Period.init(availability).includes(period),
    );
    if (!isAvailable) throw new Unavailable(id, period);

    const isAlreadyAssigned = assignments.some((assigned) =>
      assigned.isOverlapping(period),
    );
    if (isAlreadyAssigned) throw new AlreadyAssigned(id, period);

    const isOnBreak = breakPeriods.some((breakPeriod) =>
      Period.init(breakPeriod).isOverlapping(period),
    );
    if (isOnBreak) throw new HasBreak(id, period);
  }
}
