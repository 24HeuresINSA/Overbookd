import {
  DatabaseAssignment,
  DatabaseFtUserRequest,
} from 'src/assignment/assignment.model';
import { VolunteerTask } from 'src/user/user.service';

export function formatAssignmentAsTask({
  timespan,
  timespanId,
}: DatabaseAssignment): VolunteerTask {
  const { start, end } = timespan;
  const { ft } = timespan.timeWindow;
  return { start, end, ft, timespanId };
}

export function formatRequirementAsTask({
  ftTimeWindows: { start, end, ft },
}: DatabaseFtUserRequest): VolunteerTask {
  return {
    start,
    end,
    ft,
  };
}
