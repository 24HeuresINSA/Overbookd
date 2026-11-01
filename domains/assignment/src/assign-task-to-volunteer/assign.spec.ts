import { describe, expect, it } from "vitest";
import {
  CATERING,
  CONDUCTEUR,
  CONFIANCE,
  PERSONNE,
  VIEUX,
} from "@overbookd/team-code";
import { NO_PREF } from "@overbookd/preference";
import { IProvidePeriod, Period } from "@overbookd/time";
import {
  AlreadyAssigned,
  HasBreak,
  Unavailable,
  VolunteerNotFoundError,
  WrongTeam,
} from "../assignment.error.js";
import { BreakPeriod } from "../break-periods/break-periods.js";
import { defaultFriendCount } from "../friends.js";
import { VolunteerWithAssignments } from "../assign-volunteer-to-task/assign-volunteer-to-task.js";
import { InMemoryVolunteers } from "../assign-volunteer-to-task/volunteers.inmemory.js";
import { Assign } from "./assign.js";
import { InMemoryAssignments } from "./repositories/assignments.inmemory.js";
import { InMemoryAvailabilities } from "./funnel/availabilities.inmemory.js";
import { InMemoryBreakPeriods } from "./funnel/break-periods.inmemory.js";
import {
  benevolant,
  nettoyerEspaceConcessions,
} from "./funnel/assign-volunteers-funnel.test-utils.js";

const friday06hToSunday20h = {
  start: new Date("2024-05-17T06:00:00+02:00"),
  end: new Date("2024-05-19T20:00:00+02:00"),
};
const monday08hToSunday20h = {
  start: new Date("2024-05-13T08:00:00+02:00"),
  end: new Date("2024-05-19T20:00:00+02:00"),
};
const nextWeek = {
  start: new Date("2024-05-20T18:00:00+02:00"),
  end: new Date("2024-05-21T02:00:00+02:00"),
};
const sunday02hTo06h = {
  start: new Date("2024-05-19T02:00:00+02:00"),
  end: new Date("2024-05-19T06:00:00+02:00"),
};
const friday09hTo11h = Period.init({
  start: new Date("2024-05-17T09:00:00+02:00"),
  end: new Date("2024-05-17T11:00:00+02:00"),
});

const volunteerOf = (
  partial: Partial<VolunteerWithAssignments> &
    Pick<VolunteerWithAssignments, "id" | "teams">,
): VolunteerWithAssignments => ({
  firstName: "Prénom",
  lastName: "Nom",
  charisma: 0,
  birthDate: new Date("2000-01-01"),
  assignmentPreference: NO_PREF,
  friendCount: defaultFriendCount,
  assignments: [],
  ...partial,
});

const lea = volunteerOf({ id: 2, teams: [PERSONNE, VIEUX, CONDUCTEUR] });
const noel = volunteerOf({
  id: 1,
  teams: [PERSONNE, VIEUX],
  assignments: [friday09hTo11h],
});
const tatouin = volunteerOf({ id: 4, teams: [PERSONNE, VIEUX, CONDUCTEUR] });

describe("Assign volunteers", () => {
  const setup = () => {
    const assignments = new InMemoryAssignments([
      benevolant,
      nettoyerEspaceConcessions,
    ]);
    const allVolunteers = new InMemoryVolunteers([lea, noel, tatouin]);
    const availabilities = new InMemoryAvailabilities(
      new Map<number, IProvidePeriod[]>([
        [lea.id, [friday06hToSunday20h]],
        [noel.id, [monday08hToSunday20h]],
        [tatouin.id, [nextWeek]],
      ]),
    );
    const breakPeriods = new InMemoryBreakPeriods(
      new Map<number, BreakPeriod[]>([
        [lea.id, [{ name: "Pause", ...sunday02hTo06h }]],
      ]),
    );
    const assign = new Assign(
      assignments,
      allVolunteers,
      availabilities,
      breakPeriods,
    );
    return { assignments, assign };
  };

  const assigneesOf = (assignments: InMemoryAssignments, taskId: number) =>
    assignments.all.find((a) => a.taskId === taskId)?.assignees;

  describe("when the volunteer can be assigned", () => {
    it("should assign the volunteer as team member on the assignment", async () => {
      const { assignments, assign } = setup();
      const result = await assign.volunteers({
        assignment: benevolant,
        volunteers: [{ id: lea.id, as: PERSONNE }],
      });
      const expectedAssignee = { id: lea.id, as: PERSONNE };
      expect(result.assignees).toContainEqual(expectedAssignee);
      expect(assigneesOf(assignments, benevolant.taskId)).toContainEqual(
        expectedAssignee,
      );
    });

    it("should allow assigning on an implicit team", async () => {
      const { assign } = setup();
      const result = await assign.volunteers({
        assignment: benevolant,
        volunteers: [{ id: lea.id, as: CONFIANCE }],
      });
      expect(result.assignees).toContainEqual({ id: lea.id, as: CONFIANCE });
    });
  });

  describe("when the volunteer is not member of the team they are assigned as", () => {
    it("should indicate that the volunteer can't be assigned as this team and assign no one", async () => {
      const { assignments, assign } = setup();
      await expect(
        assign.volunteers({
          assignment: benevolant,
          volunteers: [{ id: lea.id, as: CATERING }],
        }),
      ).rejects.toThrow(WrongTeam);
      expect(assigneesOf(assignments, benevolant.taskId)).toEqual([]);
    });
  });

  describe("when the volunteer does not exist", () => {
    it("should indicate that the volunteer doesn't exist", async () => {
      const { assign } = setup();
      await expect(
        assign.volunteers({
          assignment: benevolant,
          volunteers: [{ id: 999, as: PERSONNE }],
        }),
      ).rejects.toThrow(VolunteerNotFoundError);
    });
  });

  describe("when the volunteer is not available on the assignment period", () => {
    it("should indicate that the volunteer isn't available on the assignment period", async () => {
      const { assign } = setup();
      await expect(
        assign.volunteers({
          assignment: benevolant,
          volunteers: [{ id: tatouin.id, as: PERSONNE }],
        }),
      ).rejects.toThrow(Unavailable);
    });
  });

  describe("when the volunteer is already assigned on an overlapping period", () => {
    it("should indicate that the volunteer is already assigned on an overlapping period", async () => {
      const { assign } = setup();
      await expect(
        assign.volunteers({
          assignment: benevolant,
          volunteers: [{ id: noel.id, as: PERSONNE }],
        }),
      ).rejects.toThrow(AlreadyAssigned);
    });
  });

  describe("when the volunteer has a break on an overlapping period", () => {
    it("should indicate that the volunteer has a break on an overlapping period", async () => {
      const { assign } = setup();
      await expect(
        assign.volunteers({
          assignment: nettoyerEspaceConcessions,
          volunteers: [{ id: lea.id, as: PERSONNE }],
        }),
      ).rejects.toThrow(HasBreak);
    });
  });

  describe("when one of the volunteers cannot be assigned", () => {
    it("should indicate that no volunteer is assigned when one of them can't be", async () => {
      const { assignments, assign } = setup();
      await expect(
        assign.volunteers({
          assignment: benevolant,
          volunteers: [
            { id: lea.id, as: PERSONNE },
            { id: tatouin.id, as: PERSONNE },
          ],
        }),
      ).rejects.toThrow(Unavailable);
      expect(assigneesOf(assignments, benevolant.taskId)).toEqual([]);
    });
  });

  describe("when the assignment does not exist", () => {
    it("should indicate that the assignment doesn't exist", async () => {
      const { assign } = setup();
      await expect(
        assign.volunteers({
          assignment: {
            taskId: 999,
            mobilizationId: "unknown",
            assignmentId: "unknown",
          },
          volunteers: [{ id: lea.id, as: PERSONNE }],
        }),
      ).rejects.toThrow("Not Found");
    });
  });
});
