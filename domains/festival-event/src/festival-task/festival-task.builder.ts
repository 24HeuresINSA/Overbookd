import { DRAFT } from "../common/status";
import {
  Draft,
  FestivalTask,
  InReview,
  PreviewDraft,
  PreviewInReview,
} from "./festival-task";
import { Preview } from "./festival-task";

type WithoutConflicts = FestivalTask<{ withConflicts: false }>;

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
  static preview(task: Draft<{ withConflicts: false }>): PreviewDraft {
    const { id, status, general } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}

class InReviewBuidler {
  static preview(task: InReview<{ withConflicts: false }>): PreviewInReview {
    const { id, status, general, reviews } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews };
  }
}

function isDraft(
  task: WithoutConflicts,
): task is Draft<{ withConflicts: false }> {
  return task.status === DRAFT;
}
