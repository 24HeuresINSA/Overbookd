import { Context } from "../context";
import { AssignmentVolunteer, Friends } from "@overbookd/assignment";

export class FriendsRepository implements Friends {
  constructor(private readonly context: Context) {}

  async for(volunteer: number): Promise<AssignmentVolunteer[]> {
    console.log(`Should take a look at volunteer #${volunteer} friends`);
    return Promise.resolve([]); // TODO implement endpoint
  }
}
