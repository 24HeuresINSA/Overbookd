import { beforeEach, describe, expect, it } from "vitest";
import { getFactory } from "../festival-activity.factory";
import {
  APPROVED,
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa
} from "../sections/reviews";
import {
  BACKLINE,
  CONTENEUR_SCENE_ROOTS,
  LOCAL_24H,
  MAGASIN,
  PARKING_EIFFEL
} from "../sections/inquiry";
import {
  deuxMarteaux,
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
    ]);
    reviewing = new Reviewing(festivalActivities);
  });
  describe.each`
    team         | festivalActivityName                        | festivalActivityId
    ${secu}      | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${secu}      | ${extremJump.general.name}                  | ${extremJump.id}
    ${matos}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${matos}     | ${extremJump.general.name}                  | ${extremJump.id}
    ${matos}     | ${withInvalidBarrierInquiries.general.name} | ${withInvalidBarrierInquiries.id}
    ${matos}     | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}
    ${humain}    | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${humain}    | ${extremJump.general.name}                  | ${extremJump.id}
    ${elec}      | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${elec}      | ${extremJump.general.name}                  | ${extremJump.id}
    ${elec}      | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}
    ${barrieres} | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${barrieres} | ${extremJump.general.name}                  | ${extremJump.id}
    ${barrieres} | ${withSomeValidInquiries.general.name}      | ${withSomeValidInquiries.id}
    ${signa}     | ${pcSecurite.general.name}                  | ${pcSecurite.id}
    ${signa}     | ${extremJump.general.name}                  | ${extremJump.id}
    ${comcom}    | ${extremJump.general.name}                  | ${extremJump.id}
  `(
    "when approving $festivalActivityName as $team member",
    ({ team, festivalActivityId }) => {
      it(`should indicate that ${team} approved it`, async () => {
        const festivalActivity = await reviewing.approve(
          festivalActivityId,
          team,
        );
        expect(festivalActivity.reviews).toHaveProperty(team, APPROVED);
      });
    },
  );
  describe("when approving several times from different teams", () => {
    it("should keep all approval", async () => {
      await reviewing.approve(extremJump.id, secu);
      const festivalActivity = await reviewing.approve(extremJump.id, comcom);
      expect(festivalActivity.reviews.secu).toBe(APPROVED);
      expect(festivalActivity.reviews.comcom).toBe(APPROVED);
    });
  });
  describe("when approving an already approved festival activity", () => {
    it("should indicate activity already approved", async () => {
      expect(
        async () => await reviewing.approve(alreadyApprovedByHumain.id, humain),
      ).rejects.toThrow(AlreadyApproved);
    });
  });
  describe("when approving a private festival activity as comcom", () => {
    it("should indicate that comcom is not asking to review it", async () => {
      expect(
        async () => await reviewing.approve(privateActivity.id, comcom),
      ).rejects.toThrow(NotAskingToReview);
    });
  });
  describe.each`
    activityName                                    | activityId                            | reviewer
    ${withInvalidGearInquiries.general.name}        | ${withInvalidGearInquiries.id}        | ${matos}
    ${withInvalidElectricityInquiries.general.name} | ${withInvalidElectricityInquiries.id} | ${elec}
    ${withInvalidBarrierInquiries.general.name}     | ${withInvalidBarrierInquiries.id}     | ${barrieres}
  `(
    "when trying to approve $activityName even with not assigned to drive inquiries as $reviewer",
    ({ activityId, reviewer }) => {
      it("should indicate that inquiries should been assigned to a drive", async () => {
        expect(
          async () => await reviewing.approve(activityId, reviewer),
        ).rejects.toThrow(ShouldAssignDrive);
      });
    },
  );
});
