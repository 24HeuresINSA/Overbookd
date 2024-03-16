import { beforeEach, describe, expect, it } from "vitest";
import {
  barCashier,
  flashMobOnJustDance,
  guardPS1,
  guardPS2,
  installEscapeGame,
  leadPressConference,
  uninstallPreventionVillage,
} from "../festival-task.fake";
import { BAR, FUN, MANUTENTION, RELOU, STATIQUE } from "../festival-task";
import { READY_TO_ASSIGN } from "../../common/status";
import { ASSIGNMENT_STARTED } from "../../common/action";
import { noel } from "../festival-task.test-util";
import { EnableAssignment } from "./enable-assignment";
import { InMemoryFestivalTasksForEnableAssignment } from "./festival-tasks-for-enable-assignment.inmemory";
import {
  FestivalTaskNotFound,
  FestivalTaskNotValidated,
  ReadyToAssignError,
} from "../festival-task.error";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Enable assignment", () => {
  let festivalTasks: InMemoryFestivalTasksForEnableAssignment;
  let enableAssignment: EnableAssignment;
  beforeEach(() => {
    const tasks = [
      guardPS1,
      guardPS2,
      barCashier,
      installEscapeGame,
      flashMobOnJustDance,
      uninstallPreventionVillage,
      leadPressConference,
    ];
    festivalTasks = new InMemoryFestivalTasksForEnableAssignment(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    enableAssignment = new EnableAssignment(festivalTasks, translator);
  });
  describe.each`
    task          | instigator | categorize
    ${guardPS1}   | ${noel}    | ${{ category: STATIQUE, topPriority: true }}
    ${guardPS2}   | ${noel}    | ${{ category: STATIQUE, topPriority: true }}
    ${barCashier} | ${noel}    | ${{ category: RELOU, topPriority: true }}
    ${barCashier} | ${noel}    | ${{ category: BAR, topPriority: false }}
    ${barCashier} | ${noel}    | ${{ category: MANUTENTION, topPriority: true }}
    ${barCashier} | ${noel}    | ${{ category: FUN, topPriority: false }}
    ${barCashier} | ${noel}    | ${{ topPriority: true }}
  `(
    "when enabling assignment for validated festival task",
    ({ task, instigator, categorize }) => {
      it(`should switch status to ${READY_TO_ASSIGN}`, async () => {
        const { status } = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(status).toBe(READY_TO_ASSIGN);
      });
      it("should keep festival task sections", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.general).toEqual(task.general);
        expect(readyToAssign.festivalActivity).toEqual(task.festivalActivity);
        expect(readyToAssign.instructions).toEqual(task.instructions);
        expect(readyToAssign.mobilizations).toEqual(task.mobilizations);
        expect(readyToAssign.inquiries).toEqual(task.inquiries);
      });
      it(`should add ${ASSIGNMENT_STARTED} key event to history`, async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );

        expect(readyToAssign.history).toStrictEqual([
          ...task.history,
          {
            action: ASSIGNMENT_STARTED,
            by: instigator,
            at: expect.any(Date),
            description: "Affectation activée pour la FT",
          },
        ]);
      });
      it("should add task category and priority", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(readyToAssign.topPriority).toBe(categorize.topPriority);
        expect(readyToAssign.category).toBe(categorize.category);
      });
      it("should be stored in task repository", async () => {
        const readyToAssign = await enableAssignment.for(
          task.id,
          instigator,
          categorize,
        );
        expect(festivalTasks.entries).toContainEqual(readyToAssign);
      });
    },
  );
  describe("when trying to enable assignment on unknown festival task", () => {
    it("should indicate festival task is not found", async () => {
      expect(
        async () =>
          await enableAssignment.for(1000, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(FestivalTaskNotFound);
    });
  });
  describe.each`
    task                          | status
    ${installEscapeGame}          | ${installEscapeGame.status}
    ${flashMobOnJustDance}        | ${flashMobOnJustDance.status}
    ${uninstallPreventionVillage} | ${uninstallPreventionVillage.status}
  `("when trying to enable assignment on $status festival task", ({ task }) => {
    it("should indicate festival task is not found", async () => {
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(FestivalTaskNotValidated);
    });
  });
  describe("when trying to enable assignment on festival task with at least on required volunteer that is not available", () => {
    it("should indicate that all required volunteers as to be available during mobilizations", async () => {
      const task = leadPressConference;
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow(ReadyToAssignError);
      expect(
        async () =>
          await enableAssignment.for(task.id, noel, {
            category: BAR,
            topPriority: false,
          }),
      ).rejects.toThrow("Au moins un des bénévoles n'est pas disponible.");
    });
  });
});
