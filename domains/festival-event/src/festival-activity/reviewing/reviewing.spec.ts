import { beforeEach, describe, expect, it } from "vitest";
import {
  APPROVED,
  REFUSED,
  REJECTED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { getFactory } from "../festival-activity.factory.js";
import {
  BACKLINE,
  CONTENEUR_SCENE_PULSE,
  LOCAL_24H,
  MAGASIN,
  PARKING_EIFFEL,
} from "../../common/inquiry-request.js";
import {
  afficheJustDanceA2,
  bacheBienvenue10m,
  deuxMarteaux,
  george,
  lea,
  noel,
  panneauEscapeGame4x3,
  quinzeVaubans,
  saturday14hToSaturday18h,
  sunday14hToSunday18h,
  uneBouilloire,
  uneMultiprise,
  uneMultiprise3Prises,
} from "../festival-activity.fake.js";
import { Reviewing } from "./reviewing.js";
import { AlreadyRejected, ShouldLinkCatalogItem } from "./reviewing.error.js";
import {
  AlreadyApproved,
  NotAskingToReview,
  ShouldAssignDrive,
} from "../../common/review.error.js";
import { InMemoryReviewingFestivalActivities } from "./reviewing-festival-activities.inmemory.js";
import { Reviewable } from "../festival-activity.js";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";

const factory = getFactory();

const pcSecurite = factory.inReview("PC Securite").build();
const extremJump = factory.inReview("Extrem Jump").asPublic({}).build();
const alreadyApprovedByHumain = factory
  .inReview("Deja Approvee par les humains")
  .withReviews({ humain: APPROVED })
  .build();
const privateActivity = factory.inReview("Private activity").build();
const withInvalidGearInquiries = factory
  .inReview("Invalid gear inquiries")
  .withInquiry({ timeWindows: [sunday14hToSunday18h], gears: [uneBouilloire] })
  .build();
const withInvalidElectricityInquiries = factory
  .inReview("Invalid electricity inquiries")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    electricity: [uneMultiprise3Prises],
  })
  .build();
const withInvalidBarrierInquiries = factory
  .inReview("Invalid barrier inquiries")
  .withInquiry({
    timeWindows: [sunday14hToSunday18h],
    barriers: [quinzeVaubans],
  })
  .build();
const withInvalidSignage = factory
  .inReview("Invalid signage")
  .withSigna({ signages: [bacheBienvenue10m] })
  .build();
const withSomeInvalidSignages = factory
  .inReview("Invalid signages")
  .withSigna({ signages: [afficheJustDanceA2, panneauEscapeGame4x3] })
  .build();
const withSomeValidInquiries = factory
  .inReview("Valid inquiries")
  .withInquiry({
    timeWindows: [saturday14hToSaturday18h, sunday14hToSunday18h],
    gears: [
      { ...uneBouilloire, drive: LOCAL_24H },
      { ...deuxMarteaux, drive: MAGASIN },
    ],
    electricity: [
      { ...uneMultiprise3Prises, drive: CONTENEUR_SCENE_PULSE },
      { ...uneMultiprise, drive: BACKLINE },
    ],
    barriers: [{ ...quinzeVaubans, drive: PARKING_EIFFEL }],
  })
  .build();
const privateWithAllApprovedExceptSecurity = factory
  .inReview("Private all approved except security")
  .withReviews({
    humain: APPROVED,
    matos: APPROVED,
    elec: APPROVED,
    barrieres: APPROVED,
    signa: APPROVED,
  })
  .build();
const publicWithAllApprovedExceptCommunication = factory
  .inReview("Public all approved except communication")
  .asPublic()
  .withReviews({
    humain: APPROVED,
    matos: APPROVED,
    elec: APPROVED,
    barrieres: APPROVED,
    signa: APPROVED,
    secu: APPROVED,
  })
  .build();
const privateValidated = factory.validated("Private Validated").build();
const alreadyRejectedByHumain = factory
  .refused("Already Rejected by humain")
  .build();

describe("Approve festival activity", () => {
  let reviewing: Reviewing;
  beforeEach(() => {
    const festivalActivities = new InMemoryReviewingFestivalActivities([
      pcSecurite,
      extremJump,
      alreadyApprovedByHumain,
      privateActivity,
      withInvalidGearInquiries,
      withInvalidElectricityInquiries,
      withInvalidBarrierInquiries,
      withInvalidSignage,
      withSomeInvalidSignages,
      withSomeValidInquiries,
      privateWithAllApprovedExceptSecurity,
      publicWithAllApprovedExceptCommunication,
    ]);
    reviewing = new Reviewing(festivalActivities);
  });
  describe.each`
    team             | festivalActivityName                        | festivalActivityId                | history                                | approver
    ${SECU}          | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${noel}
    ${SECU}          | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${noel}
    ${LOG_MATOS}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${lea}
    ${LOG_MATOS}     | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${lea}
    ${LOG_MATOS}     | ${withInvalidBarrierInquiries.general.name} | ${withInvalidBarrierInquiries.id} | ${withInvalidBarrierInquiries.history} | ${lea}
    ${LOG_MATOS}     | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${lea}
    ${HUMAIN}        | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${george}
    ${HUMAIN}        | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
    ${LOG_ELEC}      | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${lea}
    ${LOG_ELEC}      | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${lea}
    ${LOG_ELEC}      | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${lea}
    ${BARRIERES}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${noel}
    ${BARRIERES}     | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${noel}
    ${BARRIERES}     | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${noel}
    ${SIGNA}         | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${george}
    ${SIGNA}         | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
    ${COMMUNICATION} | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
  `(
    "when approving $festivalActivityName as $team member",
    ({ team, festivalActivityId, history, approver }) => {
      it(`should indicate that ${team} approved it`, async () => {
        const festivalActivity = await reviewing.approve(
          festivalActivityId,
          team,
          approver.id,
        );
        expect(festivalActivity.reviews).toHaveProperty(team, APPROVED);
      });
      it("should add APPROVED key event in history", async () => {
        const festivalActivity = await reviewing.approve(
          festivalActivityId,
          team,
          approver,
        );
        expect(festivalActivity.history).toStrictEqual([
          ...history,
          {
            action: APPROVED,
            by: approver,
            at: expect.any(Date),
            description: "FA approuvée",
          },
        ]);
      });
    },
  );
  describe("when approving several times from different teams", () => {
    it("should keep all approval", async () => {
      await reviewing.approve(extremJump.id, SECU, noel);
      const festivalActivity = await reviewing.approve(
        extremJump.id,
        COMMUNICATION,
        george,
      );
      expect(festivalActivity.reviews.secu).toBe(APPROVED);
      expect(festivalActivity.reviews.communication).toBe(APPROVED);
    });
  });
  describe("when approving an already approved festival activity", () => {
    it("should indicate activity already approved", async () => {
      expect(
        async () =>
          await reviewing.approve(alreadyApprovedByHumain.id, HUMAIN, george),
      ).rejects.toThrow(AlreadyApproved);
    });
  });
  describe("when approving a private festival activity as communication", () => {
    it("should indicate that communication is not asking to review it", async () => {
      expect(
        async () =>
          await reviewing.approve(privateActivity.id, COMMUNICATION, george),
      ).rejects.toThrow(NotAskingToReview);
    });
  });
  describe.each`
    activityName                                    | activityId                            | reviewer     | approver
    ${withInvalidGearInquiries.general.name}        | ${withInvalidGearInquiries.id}        | ${LOG_MATOS} | ${lea}
    ${withInvalidElectricityInquiries.general.name} | ${withInvalidElectricityInquiries.id} | ${LOG_ELEC}  | ${lea}
    ${withInvalidBarrierInquiries.general.name}     | ${withInvalidBarrierInquiries.id}     | ${BARRIERES} | ${noel}
  `(
    "when trying to approve $activityName even with not assigned to drive inquiries as $reviewer",
    ({ activityId, reviewer, approver }) => {
      it("should indicate that inquiries should been assigned to a drive", async () => {
        expect(
          async () =>
            await reviewing.approve(activityId, reviewer, approver.id),
        ).rejects.toThrow(ShouldAssignDrive);
      });
    },
  );
  describe.each`
    activityName                            | activityId                    | approver
    ${withInvalidSignage.general.name}      | ${withInvalidSignage.id}      | ${lea}
    ${withSomeInvalidSignages.general.name} | ${withSomeInvalidSignages.id} | ${noel}
  `(
    "when trying to approve $activityName even without catalog items linked to signages as signa",
    ({ activityId, approver }) => {
      it("should indicate that signages should been linked to a catalog item", async () => {
        expect(
          async () => await reviewing.approve(activityId, SIGNA, approver.id),
        ).rejects.toThrow(ShouldLinkCatalogItem);
      });
    },
  );

  describe.each`
    activityName                                             | activityId                                     | reviewer         | approver
    ${privateWithAllApprovedExceptSecurity.general.name}     | ${privateWithAllApprovedExceptSecurity.id}     | ${SECU}          | ${noel}
    ${publicWithAllApprovedExceptCommunication.general.name} | ${publicWithAllApprovedExceptCommunication.id} | ${COMMUNICATION} | ${george}
  `(
    "when $secu approved $activityName",
    ({ activityId, reviewer, approver }) => {
      it("should update festival activity status to VALIDATED", async () => {
        const festivalActivity = await reviewing.approve(
          activityId,
          reviewer,
          approver,
        );
        expect(festivalActivity.status).toBe(VALIDATED);
      });
    },
  );
});

describe("Reject festival activity", () => {
  let reviewing: Reviewing;
  beforeEach(() => {
    const festivalActivities = new InMemoryReviewingFestivalActivities([
      pcSecurite,
      extremJump,
      alreadyApprovedByHumain,
      privateActivity,
      withInvalidGearInquiries,
      withInvalidElectricityInquiries,
      withInvalidBarrierInquiries,
      withSomeValidInquiries,
      privateWithAllApprovedExceptSecurity,
      publicWithAllApprovedExceptCommunication,
      privateValidated,
      alreadyRejectedByHumain,
    ]);
    reviewing = new Reviewing(festivalActivities);
  });
  describe.each`
    team             | festivalActivityName             | festivalActivityId     | history                     | rejector  | reason
    ${SECU}          | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${noel}   | ${"Il faut des AS"}
    ${SECU}          | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${noel}   | ${"Il faut des AS"}
    ${LOG_MATOS}     | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${lea}    | ${"Il faut du matos"}
    ${LOG_MATOS}     | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${lea}    | ${"Il faut du matos"}
    ${HUMAIN}        | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${george} | ${"Les horaires ne sont pas pendant la manif"}
    ${HUMAIN}        | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${george} | ${"Les horaires ne sont pas pendant la manif"}
    ${LOG_ELEC}      | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${lea}    | ${"Il faut des multiprises"}
    ${LOG_ELEC}      | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${lea}    | ${"Il faut des multiprises"}
    ${BARRIERES}     | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${noel}   | ${"Il faut des heras"}
    ${BARRIERES}     | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${noel}   | ${"Il faut des heras"}
    ${SIGNA}         | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${george} | ${"Ca manque de panneau"}
    ${SIGNA}         | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${george} | ${"Ca manque de panneau"}
    ${COMMUNICATION} | ${extremJump.general.name}       | ${extremJump.id}       | ${extremJump.history}       | ${george} | ${"Il faut une photo au format paysage"}
  `(
    "when rejecting $festivalActivityName as $team member",
    ({ team, festivalActivityId, rejector, reason, history }) => {
      let festivalActivity: Reviewable;
      beforeEach(async () => {
        festivalActivity = await reviewing.reject(festivalActivityId, {
          team,
          rejector,
          reason,
        });
      });
      it(`should indicate that ${team} rejected it`, async () => {
        expect(festivalActivity.reviews).toHaveProperty(team, REJECTED);
      });
      it("should switch to REFUSED festival activity", () => {
        expect(festivalActivity.status).toBe(REFUSED);
      });
      it("should add REJECTED key event to history", () => {
        expect(festivalActivity.history).toStrictEqual([
          ...history,
          {
            action: REJECTED,
            by: rejector,
            at: expect.any(Date),
            description: `FA rejetée pour la raison suivante: ${reason}`,
          },
        ]);
      });
    },
  );

  describe("when rejecting several times from different teams", () => {
    it("should keep all rejections", async () => {
      await reviewing.reject(extremJump.id, {
        team: SECU,
        rejector: noel,
        reason: "Il faut des AS",
      });
      const festivalActivity = await reviewing.reject(extremJump.id, {
        team: COMMUNICATION,
        rejector: george,
        reason: "Il faut une meilleure description",
      });
      expect(festivalActivity.reviews.secu).toBe(REJECTED);
      expect(festivalActivity.reviews.communication).toBe(REJECTED);
    });
  });

  describe("when rejecting a private festival activity as communication", () => {
    it("should indicate that communication is not asking to review it", async () => {
      expect(
        async () =>
          await reviewing.reject(privateActivity.id, {
            team: COMMUNICATION,
            rejector: george,
            reason: "Il faut une meilleure description",
          }),
      ).rejects.toThrow(NotAskingToReview);
    });
  });

  describe("when rejecting an already rejected festival activity ", () => {
    it("should indicate activity already rejected", async () => {
      expect(
        async () =>
          await reviewing.reject(alreadyRejectedByHumain.id, {
            team: HUMAIN,
            rejector: george,
            reason: "Il faut une meilleure description",
          }),
      ).rejects.toThrow(AlreadyRejected);
    });
  });
});
