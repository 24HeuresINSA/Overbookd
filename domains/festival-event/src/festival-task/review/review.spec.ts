import { beforeEach, describe, expect, it } from "vitest";
import {
  george,
  guardJustDance,
  lea,
  noel,
  serveWaterOnJustDance,
  uninstallPreventionVillage,
} from "../festival-task.test-util";
import { elec, humain, matos } from "../../common/review";
import { REJECTED } from "../../common/action";
import { REFUSED } from "../../common/status";
import { NotAskingToReview } from "../../common/review.error";
import { Review } from "./review";
import { InMemoryFestivalTasksForReview } from "./festival-tasks-for-review.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";

describe("Reject festival task", () => {
  let review: Review;
  beforeEach(() => {
    const tasks = [
      guardJustDance,
      serveWaterOnJustDance,
      uninstallPreventionVillage,
    ];
    const festivalTasks = new InMemoryFestivalTasksForReview(tasks);
    const conflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(conflicts);
    review = new Review(festivalTasks, translator);
  });
  describe.each`
    team      | taskName                              | task                     | rejector  | reason
    ${humain} | ${guardJustDance.general.name}        | ${guardJustDance}        | ${george} | ${"Il faut que tu demandes moins de monde"}
    ${matos}  | ${guardJustDance.general.name}        | ${guardJustDance}        | ${noel}   | ${"Il te manque des clous"}
    ${elec}   | ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${lea}    | ${"Elle arrive comment l'eau ?"}
  `(
    "when rejecting $taskName as $team member",
    ({ team, task, rejector, reason }) => {
      const rejection = { team, rejector, reason };
      it(`should indicate ${team} rejected it`, async () => {
        const { reviews } = await review.reject(task.id, rejection);
        expect(reviews).toHaveProperty(team, REJECTED);
      });
      it("should switch to REFUSED festival task", async () => {
        const { status } = await review.reject(task.id, rejection);
        expect(status).toBe(REFUSED);
      });
      it("should add REJECTED key event to history", async () => {
        const { history } = await review.reject(task.id, rejection);
        expect(history).toStrictEqual([
          ...task.history,
          {
            action: REJECTED,
            by: rejector,
            at: expect.any(Date),
            description: `FT rejetée pour la raison suivante: ${reason}`,
          },
        ]);
      });
      it("should keep other task info as they were", async () => {
        const { status, history, reviews, ...previous } = task;
        const updated = await review.reject(task.id, rejection);
        expect(updated).toMatchObject(previous);
      });
    },
  );
  describe("when rejecting several times from different teams", () => {
    it("should keep all rejections", async () => {
      await review.reject(guardJustDance.id, {
        team: matos,
        rejector: noel,
        reason: "Il te manque des clous",
      });
      const { reviews } = await review.reject(guardJustDance.id, {
        team: elec,
        rejector: lea,
        reason: "Elle arrive d'où l'eau ?",
      });
      expect(reviews.elec).toBe(REJECTED);
      expect(reviews.matos).toBe(REJECTED);
    });
  });
  describe("when rejecting a task with no supply request as elec member", () => {
    it("should indicate elec is not asking to review it", async () => {
      expect(
        async () =>
          await review.reject(uninstallPreventionVillage.id, {
            team: elec,
            rejector: lea,
            reason: "Elle arrive d'où l'eau ?",
          }),
      ).rejects.toThrow(NotAskingToReview);
    });
  });
});
