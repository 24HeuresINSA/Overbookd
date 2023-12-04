import { beforeEach, describe, expect, it } from "vitest";
import { getFactory } from "../festival-activity.factory";
import {
  APPROVED,
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
  deuxMarteaux,
  george,
  lea,
  noel,
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
  NotAskingToReview,
  ShouldAssignDrive,
} from "./reviewing.error";
import { InMemoryReviewingFestivalActivities } from "./reviewing-festival-activities.inmemory";
import { VALIDATED } from "../festival-activity";

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
      withSomeValidInquiries,
      privateWithAllApprovedExceptSecurity,
      publicWithAllApprovedExceptCommunication,
    ]);
    reviewing = new Reviewing(festivalActivities);
  });
  describe.each`
    team             | festivalActivityName                        | festivalActivityId                | approver
    ${secu}          | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${noel}
    ${secu}          | ${extremJump.general.name}                  | ${extremJump.id}                  | ${noel}
    ${matos}         | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${lea}
    ${matos}         | ${extremJump.general.name}                  | ${extremJump.id}                  | ${lea}
    ${matos}         | ${withInvalidBarrierInquiries.general.name} | ${withInvalidBarrierInquiries.id} | ${lea}
    ${matos}         | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${lea}
    ${humain}        | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${george}
    ${humain}        | ${extremJump.general.name}                  | ${extremJump.id}                  | ${george}
    ${elec}          | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${lea}
    ${elec}          | ${extremJump.general.name}                  | ${extremJump.id}                  | ${lea}
    ${elec}          | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${lea}
    ${barrieres}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${noel}
    ${barrieres}     | ${extremJump.general.name}                  | ${extremJump.id}                  | ${noel}
    ${barrieres}     | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}      | ${noel}
    ${signa}         | ${pcSecurite.general.name}                  | ${pcSecurite.id}                  | ${george}
    ${signa}         | ${extremJump.general.name}                  | ${extremJump.id}                  | ${george}
    ${communication} | ${extremJump.general.name}                  | ${extremJump.id}                  | ${george}
  `(
    "when approving $festivalActivityName as $team member",
    ({ team, festivalActivityId, approver }) => {
      it("should generate a Festival Activity Approved event", async () => {
        const approved = await reviewing.approve(
          festivalActivityId,
          team,
          approver.id,
        );
        expect(approved.by).toBe(approver.id);
        expect(approved.at).toStrictEqual(expect.any(Date));
        expect(approved.at.getMilliseconds()).toBe(0);
        expect(approved.id).toStrictEqual(expect.any(Number));
      });
      describe("festival activity generated", () => {
        it(`should indicate that ${team} approved it`, async () => {
          const { festivalActivity } = await reviewing.approve(
            festivalActivityId,
            team,
            approver.id,
          );
          expect(festivalActivity.reviews).toHaveProperty(team, APPROVED);
        });
      });
    },
  );
  describe("when approving several times from different teams", () => {
    it("should keep all approval", async () => {
      await reviewing.approve(extremJump.id, secu, noel.id);
      const { festivalActivity } = await reviewing.approve(
        extremJump.id,
        communication,
        george.id,
      );
      expect(festivalActivity.reviews.secu).toBe(APPROVED);
      expect(festivalActivity.reviews.communication).toBe(APPROVED);
    });
  });
  describe("when approving an already approved festival activity", () => {
    it("should indicate activity already approved", async () => {
      expect(
        async () =>
          await reviewing.approve(
            alreadyApprovedByHumain.id,
            humain,
            george.id,
          ),
      ).rejects.toThrow(AlreadyApproved);
    });
  });
  describe("when approving a private festival activity as communication", () => {
    it("should indicate that communication is not asking to review it", async () => {
      expect(
        async () =>
          await reviewing.approve(privateActivity.id, communication, george.id),
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
    activityName                                             | activityId                                     | reviewer         | approver
    ${privateWithAllApprovedExceptSecurity.general.name}     | ${privateWithAllApprovedExceptSecurity.id}     | ${secu}          | ${noel}
    ${publicWithAllApprovedExceptCommunication.general.name} | ${publicWithAllApprovedExceptCommunication.id} | ${communication} | ${george}
  `(
    "when $secu approved $activityName",
    ({ activityId, reviewer, approver }) => {
      it("should update festival activity status to VALIDATED", async () => {
        const { festivalActivity } = await reviewing.approve(
          activityId,
          reviewer,
          approver,
        );
        expect(festivalActivity.status).toBe(VALIDATED);
      });
    },
  );
});
