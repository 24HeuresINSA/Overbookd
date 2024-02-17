import { DRAFT } from "../common/status";
import { PreviewDraft, PreviewInReview } from "./festival-task";
import { Preview } from "./festival-task";
import {
  DraftWithoutConflicts,
  InReviewWithoutConflicts,
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

    return InReviewBuidler.preview(this.task);
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

function isDraft(task: WithoutConflicts): task is DraftWithoutConflicts {
  return task.status === DRAFT;
}
