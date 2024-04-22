import { describe, expect } from "vitest";
import { InMemoryAssignments } from "./repositories/assignments.inmemory";
import {
  gererLaCaisse,
  lea,
  rendreKangoo,
} from "./funnel/assign-volunteers-funnel.test-utils";
import { Unassign } from "./unassign";

describe("Unassign volunteer", () => {
  const assignments = new InMemoryAssignments([rendreKangoo, gererLaCaisse]);
  const unassign = new Unassign(assignments);
  describe("when the volunteer is assigned to the task", async () => {
    await unassign.volunteerFromTask(gererLaCaisse, lea.volunteer.id);
    expect(assignments.all).toContainEqual({ ...gererLaCaisse, assignees: [] });
  });
});
