import { beforeEach, describe, expect, it } from "vitest";
import {
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import {
  deuxTables,
  troisMarteaux,
  george,
  lea,
  noel,
} from "../festival-task.test-util.js";
import {
  approvedByHumainAndElecRejectedByMatos,
  approvedByHumainAndMatos,
  flashMobOnJustDance,
  guardJustDance,
  leadPressConference,
  rejectedByElec,
  serveWaterOnJustDance,
  uninstallPreventionVillage,
} from "../festival-task.fake.js";
import {
  Approval,
  elec,
  humain,
  matos,
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  WILL_NOT_REVIEW,
} from "../../common/review.js";
import { APPROVED, REJECTED } from "../../common/action.js";
import { NotAskingToReview } from "../../common/review.error.js";
import { Review } from "./review.js";
import { InMemoryFestivalTasksForReview } from "./festival-tasks-for-review.inmemory.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { LOCAL_24H, MAGASIN } from "../../common/inquiry-request.js";
import { getFactory } from "../festival-task.factory.js";
import { ShouldAssignDrive } from "../../common/review.error.js";
import { AlreadyApproved } from "../../common/review.error.js";
import {
  AlreadyIgnoredFestivalTask,
  CannotIgnoreFestivalTask,
} from "../festival-task.error.js";

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
const withSupplyRequestAndMatosApprovalAndElecIgnore = factory
  .inReview("With supply request and matos approval and elec ignore")
  .withFestivalActivity({ hasSupplyRequest: true })
  .withReviews({ humain: APPROVED, elec: WILL_NOT_REVIEW })
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
      withSupplyRequestAndMatosApprovalAndElecIgnore,
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
  `("when approving $taskName as $team member", ({ task, team, reviewer }) => {
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
    team     | taskName                                                       | task                                              | reviewer
    ${matos} | ${withoutSupplyRequestAndAllApprovedExceptMatos.general.name}  | ${withoutSupplyRequestAndAllApprovedExceptMatos}  | ${noel}
    ${elec}  | ${withSupplyRequestAndAllApprovedExceptElec.general.name}      | ${withSupplyRequestAndAllApprovedExceptElec}      | ${lea}
    ${matos} | ${withSupplyRequestAndMatosApprovalAndElecIgnore.general.name} | ${withSupplyRequestAndMatosApprovalAndElecIgnore} | ${lea}
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
      const festivalTask = await review.approve(caissierBar.id, {
        team: matos,
        reviewer: noel,
      });
      expect(festivalTask.reviews.humain).toBe(APPROVED);
      expect(festivalTask.reviews.matos).toBe(APPROVED);
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
  describe("when approving task even with not assigned to drive inquiries as humain", () => {
    it("should approve task seamlessly", async () => {
      const approval: Approval<"FT"> = { team: humain, reviewer: george };
      const { reviews } = await review.approve(
        withInvalidInquiries.id,
        approval,
      );
      expect(reviews.humain).toBe(APPROVED);
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

describe("Ignore festival task", () => {
  let review: Review;
  beforeEach(() => {
    const tasks = [
      guardJustDance,
      flashMobOnJustDance,
      uninstallPreventionVillage,
      approvedByHumainAndElecRejectedByMatos,
      leadPressConference,
      rejectedByElec,
      approvedByHumainAndMatos,
    ];
    const festivalTasks = new InMemoryFestivalTasksForReview(tasks);
    const conflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(conflicts);
    review = new Review(festivalTasks, translator);
  });
  describe.each`
    taskName                                               | task                                      | reviewerStatus | expectedTaskStatus
    ${guardJustDance.general.name}                         | ${guardJustDance}                         | ${REVIEWING}   | ${IN_REVIEW}
    ${flashMobOnJustDance.general.name}                    | ${flashMobOnJustDance}                    | ${REJECTED}    | ${REFUSED}
    ${approvedByHumainAndElecRejectedByMatos.general.name} | ${approvedByHumainAndElecRejectedByMatos} | ${APPROVED}    | ${REFUSED}
    ${leadPressConference.general.name}                    | ${leadPressConference}                    | ${APPROVED}    | ${VALIDATED}
    ${rejectedByElec.general.name}                         | ${rejectedByElec}                         | ${REJECTED}    | ${IN_REVIEW}
    ${approvedByHumainAndMatos.general.name}               | ${approvedByHumainAndMatos}               | ${REVIEWING}   | ${VALIDATED}
  `(
    "when ignoring $taskName as elec reviewer with current review status $reviewerStatus",
    ({ task, expectedTaskStatus }) => {
      it("should define the elec review as WILL_NOT_REVIEW", async () => {
        const { reviews } = await review.ignore(task.id, elec);
        expect(reviews.elec).toBe(WILL_NOT_REVIEW);
      });
      it(`should switch to ${expectedTaskStatus} festival task`, async () => {
        const { status } = await review.ignore(task.id, elec);
        expect(status).toBe(expectedTaskStatus);
      });
    },
  );
  describe("when ignoring a task that does not require a review from elec", () => {
    it("should indicate that only elec can ingore festival task review", async () => {
      await expect(
        review.ignore(uninstallPreventionVillage.id, elec),
      ).rejects.toThrow(AlreadyIgnoredFestivalTask);
    });
  });
  describe.each`
    reviewer  | taskName                            | task
    ${humain} | ${guardJustDance.general.name}      | ${guardJustDance}
    ${matos}  | ${flashMobOnJustDance.general.name} | ${flashMobOnJustDance}
  `(
    "when ignoring a task that does not require a review from $reviewer team",
    ({ reviewer, task }) => {
      it(`should indicate that only elec can ingore festival task review`, async () => {
        await expect(review.ignore(task.id, reviewer)).rejects.toThrow(
          CannotIgnoreFestivalTask,
        );
      });
    },
  );
});
