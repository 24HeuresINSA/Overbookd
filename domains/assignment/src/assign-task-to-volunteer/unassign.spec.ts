import { describe, expect, it } from "vitest";
import { InMemoryAssignments } from "./repositories/assignments.inmemory.js";
import {
  gererLaCaisse,
  lea,
  rendreKangoo,
} from "./funnel/assign-volunteers-funnel.test-utils.js";
import { Unassign } from "./unassign.js";

describe("Unassign volunteer", () => {
  const assignments = new InMemoryAssignments([rendreKangoo, gererLaCaisse]);
  const unassign = new Unassign(assignments);
  describe("when the volunteer is assigned to an assignment", async () => {
    it("should unassign the volunteer", async () => {
      await unassign.volunteer(gererLaCaisse, lea.volunteer.id);
      expect(assignments.all).toContainEqual({
        ...gererLaCaisse,
        assignees: [],
      });
    });
  });
});
