import {
  DatabaseAssignment,
  DatabaseFtUserRequest,
} from "../assignment/model/assignment.model";
import { VolunteerTask } from "../../src/user/user.model";

export function formatAssignmentAsTask({
  timeSpan,
  timeSpanId,
}: DatabaseAssignment): VolunteerTask {
  const { start, end } = timeSpan;
  const { ft } = timeSpan.timeWindow;
  return { start, end, ft, timeSpanId };
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
