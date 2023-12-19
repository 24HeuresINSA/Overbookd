import { beforeEach, describe, expect, it } from "vitest";
import { getFactory } from "../festival-activity.factory";
import {
  APPROVED,
  REJECTED,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../sections/reviews";
import {
  BACKLINE,
  CONTENEUR_SCENE_ROOTS,
  LOCAL_24H,
  MAGASIN,
  PARKING_EIFFEL,
} from "../sections/inquiry";
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
} from "../festival-activity.fake";
import { Reviewing } from "./reviewing";
import {
  AlreadyApproved,
  AlreadyRejected,
  NotAskingToReview,
  ShouldAssigCatalogItem,
  ShouldAssignDrive,
} from "./reviewing.error";
import { InMemoryReviewingFestivalActivities } from "./reviewing-festival-activities.inmemory";
import { REFUSED, Reviewable, VALIDATED } from "../festival-activity";

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
      { ...uneMultiprise3Prises, drive: CONTENEUR_SCENE_ROOTS },
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
    ${secu}          | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${noel}
    ${secu}          | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${noel}
    ${matos}         | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${lea}
    ${matos}         | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${lea}
    ${matos}         | ${withInvalidBarrierInquiries.general.name} | ${withInvalidBarrierInquiries.id} | ${withInvalidBarrierInquiries.history} | ${lea}
    ${matos}         | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${lea}
    ${humain}        | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${george}
    ${humain}        | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
    ${elec}          | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${lea}
    ${elec}          | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${lea}
    ${elec}          | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${lea}
    ${barrieres}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${noel}
    ${barrieres}     | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${noel}
    ${barrieres}     | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${withSomeValidInquiries.history}      | ${noel}
    ${signa}         | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${pcSecurite.history}                  | ${george}
    ${signa}         | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
    ${communication} | ${extremJump.general.name}                  | ${extremJump.id}                  | ${extremJump.history}                  | ${george}
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
      await reviewing.approve(extremJump.id, secu, noel);
      const festivalActivity = await reviewing.approve(
        extremJump.id,
        communication,
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
          await reviewing.approve(alreadyApprovedByHumain.id, humain, george),
      ).rejects.toThrow(AlreadyApproved);
    });
  });
  describe("when approving a private festival activity as communication", () => {
    it("should indicate that communication is not asking to review it", async () => {
      expect(
        async () =>
          await reviewing.approve(privateActivity.id, communication, george),
      ).rejects.toThrow(NotAskingToReview);
    });
  });
  describe.each`
    activityName                                    | activityId                            | reviewer     | approver
    ${withInvalidGearInquiries.general.name}        | ${withInvalidGearInquiries.id}        | ${matos}     | ${lea}
    ${withInvalidElectricityInquiries.general.name} | ${withInvalidElectricityInquiries.id} | ${elec}      | ${lea}
    ${withInvalidBarrierInquiries.general.name}     | ${withInvalidBarrierInquiries.id}     | ${barrieres} | ${noel}
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
          async () => await reviewing.approve(activityId, signa, approver.id),
        ).rejects.toThrow(ShouldAssigCatalogItem);
      });
    },
  );

  describe.each`
    activityName                                             | activityId                                     | reviewer         | approver
    ${privateWithAllApprovedExceptSecurity.general.name}     | ${privateWithAllApprovedExceptSecurity.id}     | ${secu}          | ${noel}
    ${publicWithAllApprovedExceptCommunication.general.name} | ${publicWithAllApprovedExceptCommunication.id} | ${communication} | ${george}
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
    ${secu}          | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${noel}   | ${"Il faut des AS"}
    ${secu}          | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${noel}   | ${"Il faut des AS"}
    ${matos}         | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${lea}    | ${"Il faut du matos"}
    ${matos}         | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${lea}    | ${"Il faut du matos"}
    ${humain}        | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${george} | ${"Les horaires ne sont pas pendant la manif"}
    ${humain}        | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${george} | ${"Les horaires ne sont pas pendant la manif"}
    ${elec}          | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${lea}    | ${"Il faut des multiprises"}
    ${elec}          | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${lea}    | ${"Il faut des multiprises"}
    ${barrieres}     | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${noel}   | ${"Il faut des heras"}
    ${barrieres}     | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${noel}   | ${"Il faut des heras"}
    ${signa}         | ${pcSecurite.general.name}       | ${pcSecurite.id}       | ${pcSecurite.history}       | ${george} | ${"Ca manque de panneau"}
    ${signa}         | ${privateValidated.general.name} | ${privateValidated.id} | ${privateValidated.history} | ${george} | ${"Ca manque de panneau"}
    ${communication} | ${extremJump.general.name}       | ${extremJump.id}       | ${extremJump.history}       | ${george} | ${"Il faut une photo au format paysage"}
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
      it("should switch to REFUSED festuval activity", () => {
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
        team: secu,
        rejector: noel,
        reason: "Il faut des AS",
      });
      const festivalActivity = await reviewing.reject(extremJump.id, {
        team: communication,
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
            team: communication,
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
            team: humain,
            rejector: george,
            reason: "Il faut une meilleure description",
          }),
      ).rejects.toThrow(AlreadyRejected);
    });
  });
});
