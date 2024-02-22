import { beforeEach, describe, expect, it } from "vitest";
import {
  deuxTables,
  troisMarteaux,
  george,
  guardJustDance,
  lea,
  noel,
  serveWaterOnJustDance,
  uninstallPreventionVillage,
} from "../festival-task.test-util";
import { Approval, elec, humain, matos } from "../../common/review";
import { APPROVED, REJECTED } from "../../common/action";
import { IN_REVIEW, REFUSED, VALIDATED } from "../../common/status";
import { NotAskingToReview } from "../../common/review.error";
import { Review } from "./review";
import { InMemoryFestivalTasksForReview } from "./festival-tasks-for-review.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { LOCAL_24H, MAGASIN } from "../../common/inquiry-request";
import { getFactory } from "../festival-task.factory";
import { ShouldAssignDrive } from "../../common/review.error";
import { AlreadyApproved } from "../../common/review.error";

const factory = getFactory();

const caissierBar = factory.inReview("Caissier Bar").build();
const withSupplyRequest = factory
  .inReview("Avec besoin en eau ou en elec")
  .withFestivalActivity({ hasSupplyRequest: true })
  .build();
const withoutSupplyRequest = factory
  .inReview("Sans besoin en eau ou en elec")
  .withFestivalActivity({ hasSupplyRequest: false })
  .build();
const alreadyApprovedByHumain = factory
  .inReview("Deja Approvee par les humains")
  .withReviews({ humain: APPROVED })
  .build();
const withInvalidInquiries = factory
  .inReview("Invalid gear inquiries")
  .withInquiries([deuxTables])
  .build();
const withSomeValidInquiries = factory
  .inReview("Valid inquiries")
  .withInquiries([
    { ...deuxTables, drive: LOCAL_24H },
    { ...troisMarteaux, drive: MAGASIN },
  ])
  .build();
const withoutSupplyRequestAndAllApprovedExceptMatos = factory
  .inReview("Without supply request and all approved except matos")
  .withReviews({ humain: APPROVED })
  .build();
const withSupplyRequestAndAllApprovedExceptElec = factory
  .inReview("With supply request and all approved except elec")
  .withFestivalActivity({ hasSupplyRequest: true })
  .withReviews({ humain: APPROVED, matos: APPROVED })
  .build();

describe("Approve festival task", () => {
  let review: Review;
  beforeEach(() => {
    const tasks = [
      caissierBar,
      withSupplyRequest,
      withoutSupplyRequest,
      alreadyApprovedByHumain,
      withInvalidInquiries,
      withSomeValidInquiries,
      withoutSupplyRequestAndAllApprovedExceptMatos,
      withSupplyRequestAndAllApprovedExceptElec,
    ];
    const festivalTasks = new InMemoryFestivalTasksForReview(tasks);
    const conflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(conflicts);
    review = new Review(festivalTasks, translator);
  });
  describe.each`
    team      | taskName                               | task                      | reviewer
    ${humain} | ${caissierBar.general.name}            | ${caissierBar}            | ${george}
    ${matos}  | ${withSomeValidInquiries.general.name} | ${withSomeValidInquiries} | ${noel}
    ${elec}   | ${withSupplyRequest.general.name}      | ${withSupplyRequest}      | ${lea}
  `("when approving $task.name as $team member", ({ task, team, reviewer }) => {
    const approval = { team, reviewer };
    it(`should indicate ${team} approved it`, async () => {
      const { reviews } = await review.approve(task.id, approval);
      expect(reviews).toHaveProperty(team, APPROVED);
    });
    it("should stay to IN_REVIEW festival task", async () => {
      const { status } = await review.approve(task.id, approval);
      expect(status).toBe(IN_REVIEW);
    });
    it("should add APPROVED key event to history", async () => {
      const { history } = await review.approve(task.id, approval);
      expect(history).toStrictEqual([
        ...task.history,
        {
          action: APPROVED,
          by: reviewer,
          at: expect.any(Date),
          description: "FT approuvée",
        },
      ]);
    });
    it("should keep other task info as they were", async () => {
      const { status, history, reviews, ...previous } = task;
      const updated = await review.approve(task.id, approval);
      expect(updated).toMatchObject(previous);
    });
  });
  describe.each`
    team     | taskName                                                      | task                                             | reviewer
    ${matos} | ${withoutSupplyRequestAndAllApprovedExceptMatos.general.name} | ${withoutSupplyRequestAndAllApprovedExceptMatos} | ${noel}
    ${elec}  | ${withSupplyRequestAndAllApprovedExceptElec.general.name}     | ${withSupplyRequestAndAllApprovedExceptElec}     | ${lea}
  `("when last reviewer approves $taskName", ({ task, team, reviewer }) => {
    const approval = { team, reviewer };
    it("should switch to VALIDATED festival task", async () => {
      const { status } = await review.approve(task.id, approval);
      expect(status).toBe(VALIDATED);
    });
  });
  describe("when approving several times from different teams", () => {
    it("should keep all approval", async () => {
      await review.approve(caissierBar.id, { team: humain, reviewer: lea });
      const festivalActivity = await review.approve(caissierBar.id, {
        team: matos,
        reviewer: noel,
      });
      expect(festivalActivity.reviews.humain).toBe(APPROVED);
      expect(festivalActivity.reviews.matos).toBe(APPROVED);
    });
  });
  describe("when trying to approve task even with not assigned to drive inquiries as matos", () => {
    it("should indicate that inquiries should been assigned to a drive", async () => {
      const approval: Approval<"FT"> = { team: matos, reviewer: noel };
      expect(
        async () => await review.approve(withInvalidInquiries.id, approval),
      ).rejects.toThrow(new ShouldAssignDrive("FT"));
    });
  });
  describe("when approving an already approved festival task", () => {
    it("should indicate task already approved", async () => {
      const approval: Approval<"FT"> = { team: humain, reviewer: george };
      expect(
        async () => await review.approve(alreadyApprovedByHumain.id, approval),
      ).rejects.toThrow(AlreadyApproved);
    });
  });
  describe("when approving a festival task without supply request as elec", () => {
    it("should indicate that elec is not asking to review it", async () => {
      const approval: Approval<"FT"> = { team: elec, reviewer: george };
      expect(
        async () => await review.approve(caissierBar.id, approval),
      ).rejects.toThrow(NotAskingToReview);
    });
  });
});

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
