import { DatabaseFtUserRequest } from "../assignment/old/model/assignment.model";
import { VolunteerTask } from "../../src/user/user.model";

export function formatRequirementAsTask({
  ftTimeWindows: { start, end, ft },
}: DatabaseFtUserRequest): VolunteerTask {
  return {
    start,
    end,
    ft,
  };
}
