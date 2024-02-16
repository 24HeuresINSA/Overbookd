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
import { InMemoryAskForReviewTasks } from "./ask-for-review-tasks.inmemory";

describe("Festival Task - ask for review", () => {
  let notifications: InMemoryNotifications<"FT">;
  let askForReview: AskForReview;
  let tasks: InMemoryAskForReviewTasks;
  beforeEach(() => {
    tasks = new InMemoryAskForReviewTasks([
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
    ]);
    notifications = new InMemoryNotifications<"FT">();
    askForReview = new AskForReview(tasks, notifications);
  });
  describe("when asking a review for draft festival activity", () => {
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
        it("should keep draft festival activity sections", async () => {
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
            ...installJustDance.history,
            {
              action: READY_TO_REVIEW,
              by: instigator,
              at: expect.any(Date),
              description: "Demande de relecture de la FT",
            },
          ]);
        });
        it("should be stored in task repository", async () => {
          const inReview = await askForReview.from(task.id, instigator);
          expect(tasks.entries).toContainEqual(inReview);
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
});

function isReviewer(team: string): team is Reviewer<"FT"> {
  return [elec, humain, matos].includes(team);
}
