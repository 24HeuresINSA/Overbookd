import { Period } from "@overbookd/period";
import { Context } from "../context";
import { AssignmentVolunteer, Friends } from "@overbookd/assignment";
import { HttpStringified } from "@overbookd/http";

export class FriendsRepository implements Friends {
  private readonly basePath = "assignments/task-to-volunteer/volunteers";

  constructor(private readonly context: Context) {}

  async availableDuringWith(
    { start, end }: Period,
    volunteer: number,
  ): Promise<AssignmentVolunteer[]> {
    const res = await this.context.$axios.get<
      HttpStringified<AssignmentVolunteer[]>
    >(`${this.basePath}/${volunteer}/available-friends`, {
      params: { start, end },
    });

    return res.data;
  }
}
