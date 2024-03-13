import { beforeEach, describe, expect, it } from "vitest";
import { barCashier, guardPS1, guardPS2 } from "../festival-task.fake";
import { BAR, FUN, MANUTENTION, RELOU, STATIQUE } from "../festival-task";
import { READY_TO_ASSIGN } from "../../common/status";
import { ASSIGNMENT_STARTED } from "../../common/action";
import { noel } from "../festival-task.test-util";
import { EnableAssignment } from "./enable-assignment";
import { InMemoryFestivalTasksForEnableAssignment } from "./festival-tasks-for-enable-assignment.inmemory";

describe("Enable assignment", () => {
  let festivalTasks: InMemoryFestivalTasksForEnableAssignment;
  let enableAssignment: EnableAssignment;
  beforeEach(() => {
    festivalTasks = new InMemoryFestivalTasksForEnableAssignment([
      guardPS1,
      guardPS2,
      barCashier,
    ]);
    enableAssignment = new EnableAssignment(festivalTasks);
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
});
