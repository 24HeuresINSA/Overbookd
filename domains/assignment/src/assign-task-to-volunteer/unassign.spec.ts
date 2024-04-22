import { describe, expect, it } from "vitest";
import { InMemoryAssignments } from "../common/repositories/assignments.inmemory";
import {
  gererLaCaisse,
  lea,
  rendreKangoo,
} from "./funnel/assign-volunteers-funnel.test-utils";
import { Unassign } from "./unassign";

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
