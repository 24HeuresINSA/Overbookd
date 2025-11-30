import { Draft, FestivalTask, InReview, Refused } from "../festival-task.js";
import { Adherent } from "../../common/adherent.js";
import {
  FestivalTaskError,
  FestivalTaskNotFound,
} from "../festival-task.error.js";
import { Notifications } from "../../common/notifications.js";
import {
  DraftWithoutConflicts,
  FestivalTaskTranslator,
  InReviewWithConflicts,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
} from "../volunteer-conflicts.js";
import { InReviewFestivalTask } from "./in-review-festival-task.js";
import { isDraft, isRefused } from "../../festival-event.js";
import { CantAskForReview } from "../../common/review.error.js";
import { Reviewer } from "../../common/review.js";
import { HUMAIN, LOG_ELEC, LOG_MATOS } from "@overbookd/team-constants";

export type AskForReviewTasks = {
  findById(
    id: FestivalTask["id"],
  ): Promise<DraftWithoutConflicts | RefusedWithoutConflicts | null>;
  save(task: InReview): Promise<InReviewWithoutConflicts>;
};

export type ReviewerStat = {
  adherent: Adherent;
  count: number;
};

export type Reviewers = {
  getAll(): Promise<ReviewerStat[]>;
};

type Repositories = {
  tasks: AskForReviewTasks;
  notifications: Notifications<"FT">;
  reviewers: Reviewers;
};

export class AskForReview {
  constructor(
    private readonly repositories: Repositories,
    private readonly translator: FestivalTaskTranslator,
  ) {}

  async from(
    taskId: FestivalTask["id"],
    instigator: Adherent,
  ): Promise<InReviewWithConflicts> {
    const task = await this.repositories.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    if (!isDraft(task) && !isRefused(task)) {
      throw new CantAskForReview(taskId);
    }

    const inReview = await this.convertInReview(task, instigator);

    this.repositories.notifications.add(inReview.event);

    const saved = await this.repositories.tasks.save(inReview.task);
    return this.translator.translate<InReview>(saved);
  }

  private async convertInReview(task: Draft | Refused, instigator: Adherent) {
    if (isDraft(task)) {
      const reviewer = await this.findReviewer(task.general.administrator);
      return InReviewFestivalTask.fromDraft(task, instigator, reviewer);
    }

    return InReviewFestivalTask.fromRefused(task, instigator);
  }

  private async findReviewer(
    administrator: FestivalTask["general"]["administrator"],
  ): Promise<Adherent> {
    const reviewers = await this.repositories.reviewers.getAll();
    const withoutAdministrator = reviewers.filter(
      ({ adherent }) => adherent.id !== administrator.id,
    );

    const minReviewsCount = Math.min(
      ...withoutAdministrator.map(({ count }) => count),
    );
    const reviewer = withoutAdministrator.find(
      ({ count }) => count === minReviewsCount,
    );

    if (!reviewer) {
      throw new FestivalTaskError("Aucun relecteur humain disponible");
    }
    return reviewer.adherent;
  }
}

export function isReviewer(team: string): team is Reviewer<"FT"> {
  return [HUMAIN, LOG_MATOS, LOG_ELEC].includes(team);
}
