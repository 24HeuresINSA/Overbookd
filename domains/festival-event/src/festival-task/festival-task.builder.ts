import { isDraft, isInReview, isRefused } from "../festival-event";
import {
  PreviewDraft,
  PreviewInReview,
  PreviewRefused,
  PreviewValidated,
} from "./festival-task";
import { Preview } from "./festival-task";
import {
  DraftWithoutConflicts,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
  ValidatedWithoutConflicts,
  WithoutConflicts,
} from "./volunteer-conflicts";

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

    return ValidatedBuidler.preview(this.task);
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
    const { id, status, general, reviews } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews };
  }
}

class RefusedBuidler {
  static preview(task: RefusedWithoutConflicts): PreviewRefused {
    const { id, status, general, reviews } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews };
  }
}

class ValidatedBuidler {
  static preview(task: ValidatedWithoutConflicts): PreviewValidated {
    const { id, status, general, reviews } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews };
  }
}
