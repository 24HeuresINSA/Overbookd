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
} from "../festival-task.test-util";
import { DRAFT, IN_REVIEW } from "../../common/status";
import { Draft, FestivalTask, InReview } from "../festival-task";
import { Adherent } from "../../common/adherent";
import { READY_TO_REVIEW } from "../../common/action";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import { FestivalTaskNotFound } from "../festival-task.error";
import { InMemoryNotifications } from "../../festival-activity/ask-for-review/notifications.inmemory";
import { Notifications, WaitingForReview } from "../../common/notifications";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Reviewer,
  elec,
  humain,
  matos,
} from "../../common/review";
import { updateItemToList } from "@overbookd/list";
import { ReadyForReviewError } from "../../common/ready-for-review.error";

type AskForReviewTasks = {
  findById(id: FestivalTask["id"]): Promise<Draft | null>;
  save(task: InReview): Promise<InReview>;
};

const NO_SUPPLY_REQUEST_TASK_REVIEWS = {
  elec: NOT_ASKING_TO_REVIEW,
  matos: REVIEWING,
  humain: REVIEWING,
} as const;

const TASK_WITH_SUPPLY_REQUEST_REVIEWS = {
  elec: REVIEWING,
  matos: REVIEWING,
  humain: REVIEWING,
} as const;

const COMMON_REVIEWERS: Reviewer<"FT">[] = [humain, matos];

const SUPPLY_REQUEST_REVIEWERS: Reviewer<"FT">[] = [...COMMON_REVIEWERS, elec];

class AskForReviewError extends ReadyForReviewError {
  constructor(task: Draft) {
    super(InReviewConversion.generateErrors(task), "FT");
  }
}

class AskForReview {
  constructor(
    private readonly tasks: AskForReviewTasks,
    private readonly notifications: Notifications<"FT">,
  ) {}

  async from(taskId: FestivalTask["id"], adherent: Adherent) {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!InReviewConversion.isSatisfiedBy(task)) {
      throw new AskForReviewError(task);
    }

    const conversion = InReviewConversion.convert(task, adherent);
    this.notifications.add(conversion.event);
    return this.tasks.save(conversion.task);
  }
}

class InReviewConversion {
  private constructor(readonly task: InReview) {}

  static isSatisfiedBy(
    task: WithoutStatus<Draft>,
  ): task is WithoutStatus<InReview> {
    const hasNotConversionError = this.generateErrors(task).length === 0;
    return hasNotConversionError;
  }

  static generateErrors(task: WithoutStatus<Draft>): string[] {
    return [
      ...GeneralSpecification.generateErrors(task.general),
      ...InstructionsSpecification.generateErrors(task.instructions),
    ];
  }

  static convert(task: WithoutStatus<InReview>, adherent: Adherent) {
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.readyToReview(adherent),
    ];

    const reviews = task.festivalActivity.hasSupplyRequest
      ? TASK_WITH_SUPPLY_REQUEST_REVIEWS
      : NO_SUPPLY_REQUEST_TASK_REVIEWS;

    const inReview = { ...task, status: IN_REVIEW, history, reviews } as const;
    return new InReviewConversion(inReview);
  }

  get event(): WaitingForReview<"FT"> {
    const reviewers = this.task.festivalActivity.hasSupplyRequest
      ? SUPPLY_REQUEST_REVIEWERS
      : COMMON_REVIEWERS;

    return {
      id: this.task.id,
      name: this.task.general.name,
      reviewers,
    };
  }
}

class GeneralSpecification {
  static generateErrors(general: Draft["general"]): string[] {
    const hasNotTeam = general.team === null;
    return hasNotTeam ? [this.teamIsMandatory] : [];
  }

  static get teamIsMandatory(): string {
    return "Une équipe responsable est nécessaire";
  }
}

class InstructionsSpecification {
  static generateErrors(instructions: Draft["instructions"]): string[] {
    return [
      ...this.appointmentErrors(instructions.appointment),
      ...this.globalInstructionErrors(instructions.global),
      ...this.contactErrors(instructions.contacts),
      ...this.inChargeErrors(instructions.inCharge),
    ];
  }

  private static inChargeErrors(
    inCharge: Draft["instructions"]["inCharge"],
  ): string[] {
    const hasNotVolunteers = inCharge.volunteers.length === 0;
    const hasNotInstructions = inCharge.instruction === null;

    const isEmptySection = hasNotInstructions && hasNotVolunteers;
    const isFulfilledSection = !hasNotInstructions && !hasNotVolunteers;
    if (isEmptySection || isFulfilledSection) return [];

    return hasNotInstructions
      ? [this.inChargeInstructionIsMandatory]
      : [this.inChargeVolunteerIsMandatory];
  }

  private static contactErrors(
    contacts: Draft["instructions"]["contacts"],
  ): string[] {
    const hasNotAnyContact = contacts.length === 0;
    return hasNotAnyContact ? [this.atLeastOneContactIsMandatory] : [];
  }

  private static appointmentErrors(
    appointment: Draft["instructions"]["appointment"],
  ): string[] {
    const hasNotAppointment = appointment === null;
    return hasNotAppointment ? [this.appointmentIsMandatory] : [];
  }

  private static globalInstructionErrors(
    global: Draft["instructions"]["global"],
  ): string[] {
    const hasNotGlobalInstruction = global === null;
    return hasNotGlobalInstruction ? [this.globalInstructionIsMandatory] : [];
  }

  static get inChargeVolunteerIsMandatory(): string {
    return "Des responsables sont nécessaires pour les instructions spécifiques";
  }

  static get inChargeInstructionIsMandatory(): string {
    return "Des instructions spécifiques sont nécessaires pour les responsables";
  }

  static get atLeastOneContactIsMandatory(): string {
    return "Au moins une personne à contacter est nécessaire";
  }

  static get appointmentIsMandatory(): string {
    return "Un lieu de rendez-vous est nécessaire";
  }

  static get globalInstructionIsMandatory(): string {
    return "Des instructions sont nécessaires";
  }
}

class InMemoryAskForReviewTasks implements AskForReviewTasks {
  constructor(private tasks: FestivalTask[]) {}

  findById(id: FestivalTask["id"]): Promise<Draft | null> {
    const task = this.tasks.find(
      (task): task is Draft => task.id === id && isDraft(task),
    );
    return Promise.resolve(task ?? null);
  }

  save(task: InReview): Promise<InReview> {
    const index = this.tasks.findIndex(({ id }) => id === task.id);
    if (index === -1) throw new FestivalTaskNotFound(task.id);

    this.tasks = updateItemToList(this.tasks, index, task);
    return Promise.resolve(task);
  }

  get entries(): FestivalTask[] {
    return this.tasks;
  }
}

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

type WithoutStatus<T extends FestivalTask> = Omit<T, "status">;

function isDraft(task: FestivalTask): task is Draft {
  return task.status === DRAFT;
}
