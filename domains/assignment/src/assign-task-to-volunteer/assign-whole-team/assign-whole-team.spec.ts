import { beforeAll, describe, expect, it } from "vitest";
import {
  fulfilledAssignment,
  lea,
  missingOneHardAndAllVieuxDemandedAssignment,
  missingTwoVieuxAssignment,
  noel,
} from "../test-resources/assign-task-to-volunteer.test.utils";
import { InMemoryTeamAssignments } from "./team-assignments.inmemory";
import { AssignWholeTeam } from "./assign-whole-team";
import { PLAIZIR, VIEUX } from "@overbookd/team-code";
import { ALL_TEAM_MEMBERS } from "@overbookd/festival-event-constants";
import { Assignment } from "../assignment";

const missingOneHardAndAllVieuxDemandedWithLeaAssignedAssignment =
  missingOneHardAndAllVieuxDemandedAssignment.withAssignees([
    ...missingOneHardAndAllVieuxDemandedAssignment.assignment.assignees,
    { id: lea.id, as: VIEUX },
  ]);
const missingOneHardAndAllVieuxDemandedWithNoelAssignedAssignment =
  missingOneHardAndAllVieuxDemandedAssignment.withAssignees([
    ...missingOneHardAndAllVieuxDemandedAssignment.assignment.assignees,
    { id: noel.id, as: VIEUX },
  ]);

const missingOneHardAllVieuxAndAllPlaizirDemandedWithNoelAssignedAssignment =
  missingOneHardAndAllVieuxDemandedAssignment
    .withRequestedTeams([
      ...missingOneHardAndAllVieuxDemandedAssignment.assignment.demands,
      { team: PLAIZIR, demand: ALL_TEAM_MEMBERS },
    ])
    .withAssignees([
      ...missingOneHardAndAllVieuxDemandedAssignment.assignment.assignees,
      { id: noel.id, as: VIEUX },
    ]);
const missingOneHardAllVieuxAndAllPlaizirDemandedWithNoelAssignedAsPlaizirAssignment =
  missingOneHardAllVieuxAndAllPlaizirDemandedWithNoelAssignedAssignment.withAssignees(
    [
      ...missingOneHardAndAllVieuxDemandedAssignment.assignment.assignees,
      { id: noel.id, as: PLAIZIR },
    ],
  );

const fulfilledWithLeaAssignedAssignment = fulfilledAssignment.withAssignees([
  ...fulfilledAssignment.assignment.assignees,
  { id: lea.id, as: VIEUX },
]);

describe("Whole team assignments", () => {
  const volunteers = [noel, lea];
  let assignments: Assignment[];
  let teamAssignments: InMemoryTeamAssignments;
  let assignWholeTeam: AssignWholeTeam;

  describe("when adding missing whole team assignments", () => {
    describe("when there are missing team assignments", () => {
      beforeAll(async () => {
        assignments = [
          missingOneHardAndAllVieuxDemandedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
          fulfilledAssignment.assignment,
        ];
        teamAssignments = new InMemoryTeamAssignments(assignments, volunteers);
        assignWholeTeam = new AssignWholeTeam(teamAssignments);
        await assignWholeTeam.addMissingTeamAssignments(lea.id);
      });
      it("should add the assignments", () => {
        const expectedAssignments = [
          missingOneHardAndAllVieuxDemandedWithLeaAssignedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
          fulfilledWithLeaAssignedAssignment.assignment,
        ];
        expect(teamAssignments.all).toEqual(expectedAssignments);
      });
    });

    describe("when there are no assignments to add", () => {
      beforeAll(async () => {
        assignments = [
          missingOneHardAndAllVieuxDemandedWithLeaAssignedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
        ];
        teamAssignments = new InMemoryTeamAssignments(assignments, volunteers);
        assignWholeTeam = new AssignWholeTeam(teamAssignments);
        await assignWholeTeam.addMissingTeamAssignments(lea.id);
      });
      it("should not add any assignment", () => {
        expect(teamAssignments.all).toEqual(assignments);
      });
    });
  });

  describe("when removing irrelevant team assignments", () => {
    describe("when there are irrelevant assignments", () => {
      beforeAll(async () => {
        assignments = [
          missingOneHardAndAllVieuxDemandedWithNoelAssignedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
          fulfilledWithLeaAssignedAssignment.assignment,
        ];
        teamAssignments = new InMemoryTeamAssignments(assignments, volunteers);
        assignWholeTeam = new AssignWholeTeam(teamAssignments);
        await assignWholeTeam.removeIrrelevantTeamAssignments(noel.id);
      });
      it("should remove the assignments", () => {
        const expectedAssignments = [
          missingOneHardAndAllVieuxDemandedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
          fulfilledWithLeaAssignedAssignment.assignment,
        ];
        expect(teamAssignments.all).toEqual(expectedAssignments);
      });
    });

    describe("when there is an irrelevant assignment that should be replaced by another", () => {
      beforeAll(async () => {
        assignments = [
          missingOneHardAllVieuxAndAllPlaizirDemandedWithNoelAssignedAssignment.assignment,
        ];
        teamAssignments = new InMemoryTeamAssignments(assignments, volunteers);
        assignWholeTeam = new AssignWholeTeam(teamAssignments);
        await assignWholeTeam.removeIrrelevantTeamAssignments(noel.id);
      });
      it("should change the assignments as team", () => {
        const expectedAssignments = [
          missingOneHardAllVieuxAndAllPlaizirDemandedWithNoelAssignedAsPlaizirAssignment.assignment,
        ];
        expect(teamAssignments.all).toEqual(expectedAssignments);
      });
    });

    describe("when there are no assignments to remove", () => {
      beforeAll(async () => {
        assignments = [
          missingOneHardAndAllVieuxDemandedWithLeaAssignedAssignment.assignment,
          missingTwoVieuxAssignment.assignment,
        ];
        teamAssignments = new InMemoryTeamAssignments(assignments, volunteers);
        assignWholeTeam = new AssignWholeTeam(teamAssignments);
        await assignWholeTeam.removeIrrelevantTeamAssignments(lea.id);
      });
      it("should not remove any assignment", () => {
        expect(teamAssignments.all).toEqual(assignments);
      });
    });
  });
});
