import { describe, it, expect, beforeEach } from "vitest";
import {
  guardEscapeGame,
  installPreventionVillage,
  installJustDance,
  lea,
  noel,
  withNoAppointmentTask,
  withNoGlobalInstructionsTask,
  withNoTeamTask,
  withNotAnyContactTask,
  guardPreventionVillage,
  withInChargeVolunteerButWithNotInChargeInstruction,
  withInChargeInstructionButWithNotInChargeVolunteer,
  withoutAnyMobilization,
  withSomeMobilizationsWithoutRequest,
  flashMobOnPreventionVillage,
  flashMobOnJustDance,
} from "../festival-task.test-util";
import { IN_REVIEW } from "../../common/status";
import { READY_TO_REVIEW } from "../../common/action";
import { InMemoryNotifications } from "../../festival-activity/ask-for-review/notifications.inmemory";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Reviewer,
  elec,
  humain,
  matos,
} from "../../common/review";
import { ReadyForReviewError } from "../../common/ready-for-review.error";
import { AskForReview } from "./ask-for-review";
import { InMemoryReviewers } from "./reviewers.inmemory";
import { InMemoryAskForReviewTasks } from "./ask-for-review-tasks.inmemory";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Festival Task - ask for review", () => {
  let notifications: InMemoryNotifications<"FT">;
  let askForReview: AskForReview;
  let festivalTasks: InMemoryAskForReviewTasks;
  let translator: FestivalTaskTranslator;
  const tasks = [
    installJustDance,
    guardEscapeGame,
    installPreventionVillage,
    guardPreventionVillage,
    withNoTeamTask,
    withNoAppointmentTask,
    withNoGlobalInstructionsTask,
    withNotAnyContactTask,
    withInChargeVolunteerButWithNotInChargeInstruction,
    withInChargeInstructionButWithNotInChargeVolunteer,
    withoutAnyMobilization,
    withSomeMobilizationsWithoutRequest,
    flashMobOnPreventionVillage,
    flashMobOnJustDance,
  ];
  beforeEach(() => {
    festivalTasks = new InMemoryAskForReviewTasks(tasks);
    const reviewers = new InMemoryReviewers([{ adherent: noel, count: 0 }]);
    notifications = new InMemoryNotifications<"FT">();
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    translator = new FestivalTaskTranslator(volunteerConflicts);
    askForReview = new AskForReview(
      festivalTasks,
      { notifications, reviewers },
      translator,
    );
  });
  describe("when asking a review for draft festival task", () => {
    describe.each`
      task                        | instigator | reviewers
      ${installJustDance}         | ${noel}    | ${[humain, matos, elec]}
      ${installPreventionVillage} | ${lea}     | ${[humain, matos]}
      ${guardPreventionVillage}   | ${lea}     | ${[humain, matos]}
    `(
      "when draft festival task fulfilled all requirements (i.e. has team, has appointment location, has global instructions, if there is volunteers in charge provide a list with at least one volunteer and dedicated instructions, has at least one contact, has a least one mobilization with either volunteer or team required)",
      ({ task, instigator, reviewers }) => {
        it("should indicate it is in review", async () => {
          const inReview = await askForReview.from(task.id, instigator);
          expect(inReview.status).toBe(IN_REVIEW);
        });
        it("should keep draft festival task sections", async () => {
          const inReview = await askForReview.from(task.id, instigator);

          expect(inReview.general).toEqual(task.general);
          expect(inReview.festivalActivity).toEqual(task.festivalActivity);
          expect(inReview.instructions).toEqual(task.instructions);
          expect(inReview.mobilizations).toEqual(task.mobilizations);
          expect(inReview.inquiries).toEqual(task.inquiries);
        });
        it("should add READY_TO_REVIEW key event to history", async () => {
          const inReview = await askForReview.from(task.id, instigator);

          expect(inReview.history).toStrictEqual([
            ...task.history,
            {
              action: READY_TO_REVIEW,
              by: instigator,
              at: expect.any(Date),
              description: "Demande de relecture de la FT",
            },
          ]);
        });
        describe.each`
          humainReviews                                                  | expectedReviewer
          ${[{ adherent: noel, count: 1 }, { adherent: lea, count: 2 }]} | ${noel}
          ${[{ adherent: lea, count: 1 }, { adherent: noel, count: 2 }]} | ${lea}
          ${[{ adherent: lea, count: 1 }, { adherent: noel, count: 1 }]} | ${lea}
          ${[{ adherent: noel, count: 1 }, { adherent: lea, count: 1 }]} | ${noel}
        `("humain reviewer", ({ humainReviews, expectedReviewer }) => {
          beforeEach(() => {
            const reviewers = new InMemoryReviewers(humainReviews);
            askForReview = new AskForReview(
              festivalTasks,
              { notifications, reviewers },
              translator,
            );
          });
          it("should assign one humain reviewer to task", async () => {
            const inReview = await askForReview.from(task.id, instigator);
            expect(inReview.reviewer).toBe(expectedReviewer);
          });
        });
        it("should be stored in task repository", async () => {
          const inReview = await askForReview.from(task.id, instigator);
          expect(festivalTasks.entries).toContainEqual(inReview);
        });
        describe("reviews", () => {
          it(`should ask review from ${reviewers}`, async () => {
            const inReview = await askForReview.from(task.id, instigator);

            expect(notifications.entries).toHaveLength(reviewers.length);

            const event = { id: inReview.id, name: inReview.general.name };
            reviewers.every((team: string) =>
              expect(notifications.entries).toContainEqual({ team, event }),
            );
          });
          it.each`
            team      | status
            ${elec}   | ${task.festivalActivity.hasSupplyRequest ? REVIEWING : NOT_ASKING_TO_REVIEW}
            ${humain} | ${REVIEWING}
            ${matos}  | ${REVIEWING}
          `("should explain $team is $status", async ({ team, status }) => {
            const inReview = await askForReview.from(task.id, instigator);
            if (!isReviewer(team)) throw new Error();
            // eslint-disable-next-line security/detect-object-injection
            expect(inReview.reviews[team]).toBe(status);
          });
        });
      },
    );
    describe("when draft festival task don't fulfill at least one requirement", () => {
      describe.each`
        indication                                                        | task                                                  | instigator | explanation
        ${"without team"}                                                 | ${withNoTeamTask}                                     | ${noel}    | ${"Une équipe responsable est nécessaire"}
        ${"without appointment location"}                                 | ${withNoAppointmentTask}                              | ${noel}    | ${"Un lieu de rendez-vous est nécessaire"}
        ${"without global instructions"}                                  | ${withNoGlobalInstructionsTask}                       | ${noel}    | ${"Des instructions sont nécessaires"}
        ${"without any contact"}                                          | ${withNotAnyContactTask}                              | ${noel}    | ${"Au moins une personne à contacter est nécessaire"}
        ${"with in charge volunteers but with no in charge instructions"} | ${withInChargeVolunteerButWithNotInChargeInstruction} | ${noel}    | ${"Des instructions spécifiques sont nécessaires pour les responsables"}
        ${"with in charge instructions but with no in charge volunteers"} | ${withInChargeInstructionButWithNotInChargeVolunteer} | ${noel}    | ${"Des responsables sont nécessaires pour les instructions spécifiques"}
        ${"without any mobilization"}                                     | ${withoutAnyMobilization}                             | ${noel}    | ${"Au moins une mobilisation est nécessaire"}
        ${"with some mobilizations without any volunteer requests"}       | ${withSomeMobilizationsWithoutRequest}                | ${noel}    | ${"Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)"}
      `("when task is $indication", ({ task, instigator, explanation }) => {
        it("should indicate can't ask for review with explanation", async () => {
          expect(
            async () => await askForReview.from(task.id, instigator),
          ).rejects.toThrow(ReadyForReviewError);
          expect(
            async () => await askForReview.from(task.id, instigator),
          ).rejects.toThrow(explanation);
        });
      });
    });
  });
  describe("when asking a review for refused festival task", () => {
    describe.each`
      taskName                                    | task                           | reviewers         | instigator
      ${flashMobOnPreventionVillage.general.name} | ${flashMobOnPreventionVillage} | ${[humain]}       | ${noel}
      ${flashMobOnJustDance.general.name}         | ${flashMobOnJustDance}         | ${[humain, elec]} | ${noel}
    `(
      "when $taskName was rejected by $reviewers",
      ({ task, instigator, reviewers }) => {
        it("should indicate it is in review", async () => {
          const inReview = await askForReview.from(task.id, instigator);
          expect(inReview.status).toBe(IN_REVIEW);
        });
        it("should add READY_TO_REVIEW key event to history", async () => {
          const inReview = await askForReview.from(task.id, instigator);

          expect(inReview.history).toStrictEqual([
            ...task.history,
            {
              action: READY_TO_REVIEW,
              by: instigator,
              at: expect.any(Date),
              description: "Demande de relecture de la FT",
            },
          ]);
        });
        describe("reviews", () => {
          it(`should ask review from ${reviewers}`, async () => {
            const inReview = await askForReview.from(task.id, instigator);

            expect(notifications.entries).toHaveLength(reviewers.length);

            const event = { id: inReview.id, name: inReview.general.name };
            reviewers.every((team: string) =>
              expect(notifications.entries).toContainEqual({ team, event }),
            );
          });
          it("should set reset rejected reviews to reviewing", async () => {
            const inReview = await askForReview.from(task.id, instigator);
            const resetReviews = Object.fromEntries(
              reviewers.map((reviewer: string) => [reviewer, REVIEWING]),
            );
            const expectedReviews = { ...task.reviews, ...resetReviews };

            expect(inReview.reviews).toEqual(expectedReviews);
          });
        });
      },
    );
  });
});

function isReviewer(team: string): team is Reviewer<"FT"> {
  return [elec, humain, matos].includes(team);
}
