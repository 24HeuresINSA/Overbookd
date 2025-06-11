import { describe, it, expect, beforeEach } from "vitest";
import { IN_REVIEW } from "@overbookd/festival-event-constants";
import { george, lea, noel } from "../festival-task.test-util.js";
import {
  guardEscapeGame,
  installPreventionVillage,
  installJustDance,
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
  approvedByElecRejectedByMatos,
  rejectedByHumainAndIgnoredByMatos,
} from "../festival-task.fake.js";
import { READY_TO_REVIEW } from "../../common/action.js";
import { InMemoryNotifications } from "../../festival-activity/ask-for-review/notifications.inmemory.js";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  elec,
  humain,
  matos,
} from "../../common/review.js";
import { ReadyForReviewError } from "../../common/ready-for-review.error.js";
import { AskForReview, isReviewer } from "./ask-for-review.js";
import { InMemoryReviewers } from "./reviewers.inmemory.js";
import { InMemoryAskForReviewTasks } from "./ask-for-review-tasks.inmemory.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";

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
    approvedByElecRejectedByMatos,
    rejectedByHumainAndIgnoredByMatos,
  ];
  beforeEach(() => {
    festivalTasks = new InMemoryAskForReviewTasks(tasks);
    const reviewers = new InMemoryReviewers([
      { adherent: noel, count: 0 },
      { adherent: george, count: 1 },
    ]);
    notifications = new InMemoryNotifications<"FT">();
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    translator = new FestivalTaskTranslator(volunteerConflicts);
    askForReview = new AskForReview(
      { notifications, reviewers, tasks: festivalTasks },
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
        it("should assign one humain reviewer to task", async () => {
          const inReview = await askForReview.from(task.id, instigator);
          expect(inReview.reviewer).toBeDefined();
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
      taskName                                          | task                                 | rejectors         | instigator
      ${flashMobOnPreventionVillage.general.name}       | ${flashMobOnPreventionVillage}       | ${[humain]}       | ${noel}
      ${flashMobOnJustDance.general.name}               | ${flashMobOnJustDance}               | ${[humain, elec]} | ${noel}
      ${approvedByElecRejectedByMatos.general.name}     | ${approvedByElecRejectedByMatos}     | ${[matos]}        | ${noel}
      ${rejectedByHumainAndIgnoredByMatos.general.name} | ${rejectedByHumainAndIgnoredByMatos} | ${[humain]}       | ${noel}
    `(
      "when $taskName was rejected by $rejectors",
      ({ task, instigator, rejectors }) => {
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
          it(`should ask review from ${rejectors}`, async () => {
            const inReview = await askForReview.from(task.id, instigator);

            expect(notifications.entries).toHaveLength(rejectors.length);

            const event = { id: inReview.id, name: inReview.general.name };
            rejectors.every((team: string) =>
              expect(notifications.entries).toContainEqual({ team, event }),
            );
          });
          it("should reset rejected reviews to reviewing", async () => {
            const inReview = await askForReview.from(task.id, instigator);
            const resetReviews = Object.fromEntries(
              rejectors.map((reviewer: string) => [reviewer, REVIEWING]),
            );
            const expectedReviews = { ...task.reviews, ...resetReviews };

            expect(inReview.reviews).toEqual(expectedReviews);
          });
        });
      },
    );
  });

  describe("when asking a review for valid draft task", () => {
    describe.each`
      task                        | administrator                                       | humainReviews                                                    | expectedReviewer
      ${installJustDance}         | ${installJustDance.general.administrator.firstname} | ${[{ adherent: george, count: 1 }, { adherent: lea, count: 2 }]} | ${george}
      ${installPreventionVillage} | ${installJustDance.general.administrator.firstname} | ${[{ adherent: lea, count: 1 }, { adherent: george, count: 2 }]} | ${lea}
      ${installJustDance}         | ${installJustDance.general.administrator.firstname} | ${[{ adherent: lea, count: 1 }, { adherent: george, count: 1 }]} | ${lea}
      ${installPreventionVillage} | ${installJustDance.general.administrator.firstname} | ${[{ adherent: george, count: 1 }, { adherent: lea, count: 1 }]} | ${george}
    `(
      "when task administrator $administrator is not a humain reviewer",
      ({ task, humainReviews, expectedReviewer }) => {
        beforeEach(() => {
          const reviewers = new InMemoryReviewers(humainReviews);
          askForReview = new AskForReview(
            { tasks: festivalTasks, notifications, reviewers },
            translator,
          );
        });
        it("should assign one humain reviewer to task", async () => {
          const inReview = await askForReview.from(task.id, noel);
          expect(inReview.reviewer).toBe(expectedReviewer);
        });
      },
    );
    describe("when task administrator is a humain reviewer", () => {
      const humainReviews = [
        { adherent: noel, count: 0 },
        { adherent: lea, count: 2 },
      ];
      const reviewers = new InMemoryReviewers(humainReviews);
      it("should assign the task to a human reviewer who is not the task administrator", async () => {
        askForReview = new AskForReview(
          { tasks: festivalTasks, notifications, reviewers },
          translator,
        );
        const inReview = await askForReview.from(
          guardPreventionVillage.id,
          noel,
        );
        expect(inReview.reviewer).toBe(lea);
      });
    });
  });
});
