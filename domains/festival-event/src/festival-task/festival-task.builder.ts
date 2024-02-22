import { isDraft, isInReview } from "../festival-event";
import { PreviewDraft, PreviewInReview, PreviewRefused } from "./festival-task";
import { Preview } from "./festival-task";
import {
  DraftWithoutConflicts,
  InReviewWithoutConflicts,
  RefusedWithoutConflicts,
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

    return RefusedBuidler.preview(this.task);
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
