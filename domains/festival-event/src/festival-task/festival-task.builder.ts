import {
  isDraft,
  isInReview,
  isRefused,
  isValidated,
} from "../festival-event.js";
import {
  PreviewDraft,
  PreviewInReview,
  PreviewReadyToAssign,
  PreviewRefused,
  PreviewValidated,
} from "./festival-task.js";
import { Preview } from "./festival-task.js";
import {
  DraftWithoutConflicts,
  InReviewWithoutConflicts,
  ReadyToAssignWithoutConflicts,
  RefusedWithoutConflicts,
  ValidatedWithoutConflicts,
  WithoutConflicts,
} from "./volunteer-conflicts.js";

export class FestivalTaskBuilder {
  private constructor(private readonly task: WithoutConflicts) {}
  static build(task: WithoutConflicts) {
    return new FestivalTaskBuilder(task);
  }

  get overview(): WithoutConflicts {
    return this.task;
  }

  get preview(): Preview {
    if (isDraft(this.task)) return DraftBuilder.preview(this.task);

    if (isInReview(this.task)) return InReviewBuidler.preview(this.task);

    if (isRefused(this.task)) return RefusedBuidler.preview(this.task);

    if (isValidated(this.task)) return ValidatedBuidler.preview(this.task);

    return ReadyToAssignBuidler.preview(this.task);
  }
}

class DraftBuilder {
  static preview(task: DraftWithoutConflicts): PreviewDraft {
    const { id, status, general } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}

class InReviewBuidler {
  static preview(task: InReviewWithoutConflicts): PreviewInReview {
    const { id, status, general, reviews, reviewer } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews, reviewer };
  }
}

class RefusedBuidler {
  static preview(task: RefusedWithoutConflicts): PreviewRefused {
    const { id, status, general, reviews, reviewer } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews, reviewer };
  }
}

class ValidatedBuidler {
  static preview(task: ValidatedWithoutConflicts): PreviewValidated {
    const { id, status, general, reviews, reviewer } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews, reviewer };
  }
}

class ReadyToAssignBuidler {
  static preview(task: ReadyToAssignWithoutConflicts): PreviewReadyToAssign {
    const { id, status, general, reviews, reviewer } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews, reviewer };
  }
}
