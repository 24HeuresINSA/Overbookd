import { describe, expect } from "vitest";
import { InMemoryAssignments } from "./repositories/assignments.inmemory";
import {
  couperDesCarottes,
  lea,
  rendreKangoo,
} from "./funnel/assign-volunteers-funnel.test-utils";
import { Unassign } from "./unassign";

describe("Unassign volunteer", () => {
  const assignments = new InMemoryAssignments([
    rendreKangoo,
    couperDesCarottes,
  ]);
  const unassign = new Unassign(assignments);
  describe("when the volunteer is assigned to the task", async () => {
    await unassign.volunteerFromTask(couperDesCarottes, lea.volunteer.id);

    expect(assignments.all).toEqual([rendreKangoo]);
  });
});
