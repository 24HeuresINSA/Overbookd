import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame, justDance } from "./preparation.test-utils";
import { lea, noel } from "../festival-activity.fake";

describe("Feedbacks section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      justDance,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  it.each`
    activityName               | activityId       | author  | content
    ${escapeGame.general.name} | ${escapeGame.id} | ${noel} | ${"Il faut vérifier l'heure d'ouverture des bâtiments"}
    ${justDance.general.name}  | ${justDance.id}  | ${lea}  | ${"Ça me parait beaucoup comme demande matos"}
  `(
    "should be able to publish a feedback on $activityName",
    async ({ activityId, author, content }) => {
      const { feedbacks } = await prepareFestivalActivity.publishFeedback(
        activityId,
        { author, content },
      );
      expect(feedbacks).toContainEqual({
        author,
        content,
        publishedAt: expect.any(Date),
      });
    },
  );

  describe("when publishing several feedbacks", () => {
    it("should list all published feedbacks", async () => {
      const leaFeedback = {
        author: lea,
        content: "Ça me parait beaucoup comme demande matos",
      };
      await prepareFestivalActivity.publishFeedback(justDance.id, leaFeedback);

      const noelFeedback = {
        author: noel,
        content: "J'ai vu avec le prestataire et c'est pour lui le minimum",
      };
      const { feedbacks } = await prepareFestivalActivity.publishFeedback(
        justDance.id,
        noelFeedback,
      );

      expect(feedbacks).toContainEqual({
        ...leaFeedback,
        publishedAt: expect.any(Date),
      });
      expect(feedbacks).toContainEqual({
        ...noelFeedback,
        publishedAt: expect.any(Date),
      });
    });
  });
});
