import { Item, hasAtLeastOneItem, isEmpty } from "@overbookd/list";
import { Adherent } from "../../common/adherent";
import { WaitingForReview } from "../../common/notifications";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  Reviewer,
  humain,
  matos,
  elec,
} from "../../common/review";
import { IN_REVIEW } from "../../common/status";
import { Draft, FestivalTask, InReview } from "../festival-task";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import { DraftGeneral } from "../sections/general";

type WithoutStatus<T extends FestivalTask> = Omit<T, "status">;

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

export class InReviewSpecification {
  private constructor(readonly task: InReview) {}

  static isSatisfiedBy(
    task: WithoutStatus<Draft>,
  ): task is WithoutStatus<InReview> {
    return (
      GeneralSpecification.isSatisfiedBy(task.general) &&
      MobilizationsSpecification.isSatisfiedBy(task.mobilizations) &&
      InstructionsSpecification.isSatisfiedBy(task.instructions)
    );
  }

  static generateErrors(task: WithoutStatus<Draft>): string[] {
    return [
      ...GeneralSpecification.generateErrors(task.general),
      ...InstructionsSpecification.generateErrors(task.instructions),
      ...MobilizationsSpecification.generateErrors(task.mobilizations),
    ];
  }

  static convert(task: WithoutStatus<InReview>, adherent: Adherent) {
    const readyToReview = FestivalTaskKeyEvents.readyToReview(adherent);
    const history = [...task.history, readyToReview];

    const reviews = task.festivalActivity.hasSupplyRequest
      ? TASK_WITH_SUPPLY_REQUEST_REVIEWS
      : NO_SUPPLY_REQUEST_TASK_REVIEWS;

    const inReview = { ...task, status: IN_REVIEW, history, reviews } as const;
    return new InReviewSpecification(inReview);
  }

  get event(): WaitingForReview<"FT"> {
    const reviewers = this.task.festivalActivity.hasSupplyRequest
      ? SUPPLY_REQUEST_REVIEWERS
      : COMMON_REVIEWERS;

    return { id: this.task.id, name: this.task.general.name, reviewers };
  }
}

class GeneralSpecification {
  static isSatisfiedBy(
    general: Draft["general"],
  ): general is InReview["general"] {
    return this.hasTeam(general);
  }

  static generateErrors(general: Draft["general"]): string[] {
    const hasNotTeam = !this.hasTeam(general);
    return hasNotTeam ? [this.teamIsMandatory] : [];
  }

  private static hasTeam(general: DraftGeneral) {
    return general.team !== null;
  }

  static get teamIsMandatory(): string {
    return "Une équipe responsable est nécessaire";
  }
}

class MobilizationsSpecification {
  static isSatisfiedBy(
    mobilizations: Draft["mobilizations"],
  ): mobilizations is InReview["mobilizations"] {
    return (
      this.hasMobilization(mobilizations) &&
      mobilizations.every(MobilizationsSpecification.hasRequest)
    );
  }

  static generateErrors(mobilizations: Draft["mobilizations"]): string[] {
    return [
      ...this.minumumMobilizationError(mobilizations),
      ...this.requestError(mobilizations),
    ];
  }

  private static requestError(mobilizations: Draft["mobilizations"]): string[] {
    const isMissingRequest = mobilizations.some(
      (mobilization) => !this.hasRequest(mobilization),
    );
    return isMissingRequest ? [this.allMobilizationsHaveRequest] : [];
  }

  private static minumumMobilizationError(
    mobilizations: Draft["mobilizations"],
  ): string[] {
    const hasNotMobilizations = !this.hasMobilization(mobilizations);
    return hasNotMobilizations ? [this.atLeastOneMobilizationIsMandatory] : [];
  }

  private static hasMobilization(mobilizations: Draft["mobilizations"]) {
    return hasAtLeastOneItem(mobilizations);
  }

  private static hasRequest(
    mobilization: Item<Draft["mobilizations"]>,
  ): mobilization is Item<InReview["mobilizations"]> {
    const requestVolunteers = hasAtLeastOneItem(mobilization.volunteers);
    const requestTeamMembers = hasAtLeastOneItem(mobilization.teams);
    return requestVolunteers || requestTeamMembers;
  }

  static get atLeastOneMobilizationIsMandatory(): string {
    return "Au moins une mobilisation est nécessaire";
  }

  static get allMobilizationsHaveRequest(): string {
    return "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)";
  }
}

class InstructionsSpecification {
  static isSatisfiedBy(
    instructions: Draft["instructions"],
  ): instructions is InReview["instructions"] {
    return (
      InChargeInstructionsSpecification.isSatisfiedBy(instructions.inCharge) &&
      hasAtLeastOneItem(instructions.contacts) &&
      instructions.appointment !== null &&
      instructions.global !== null
    );
  }

  static generateErrors(instructions: Draft["instructions"]): string[] {
    return [
      ...this.appointmentErrors(instructions.appointment),
      ...this.globalInstructionErrors(instructions.global),
      ...this.contactErrors(instructions.contacts),
      ...InChargeInstructionsSpecification.generateErrors(
        instructions.inCharge,
      ),
    ];
  }

  private static contactErrors(
    contacts: Draft["instructions"]["contacts"],
  ): string[] {
    const hasNotAnyContact = !hasAtLeastOneItem(contacts);
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

type WithDedicatedInstructions = Extract<
  InReview["instructions"]["inCharge"],
  { instruction: string }
>;

type WithNoOneInCharge = Extract<
  InReview["instructions"]["inCharge"],
  { instruction: null }
>;

class InChargeInstructionsSpecification {
  static isSatisfiedBy(
    inCharge: Draft["instructions"]["inCharge"],
  ): inCharge is InReview["instructions"]["inCharge"] {
    return this.isFilled(inCharge) || this.isEmpty(inCharge);
  }

  private static isFilled(
    inCharge: Draft["instructions"]["inCharge"],
  ): inCharge is WithDedicatedInstructions {
    return (
      hasAtLeastOneItem(inCharge.volunteers) && inCharge.instruction !== null
    );
  }

  private static isEmpty(
    inCharge: Draft["instructions"]["inCharge"],
  ): inCharge is WithNoOneInCharge {
    return inCharge.instruction === null && isEmpty(inCharge.volunteers);
  }

  static generateErrors(inCharge: Draft["instructions"]["inCharge"]): string[] {
    if (this.isFilled(inCharge) || this.isEmpty(inCharge)) return [];

    const hasNotInstructions = inCharge.instruction === null;
    return hasNotInstructions
      ? [this.instructionIsMandatory]
      : [this.volunteerIsMandatory];
  }

  static get volunteerIsMandatory(): string {
    return "Des responsables sont nécessaires pour les instructions spécifiques";
  }

  static get instructionIsMandatory(): string {
    return "Des instructions spécifiques sont nécessaires pour les responsables";
  }
}
