import { DRAFT } from "../common/status";
import {
  Draft,
  FestivalTask,
  InReview,
  PreviewDraft,
  PreviewInReview,
} from "./festival-task";
import { Preview } from "./festival-task";
import { WithConflicts } from "./volunteer-conflicts";

type WithoutConflicts = Exclude<FestivalTask, WithConflicts>;

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
  static preview(task: Extract<WithoutConflicts, Draft>): PreviewDraft {
    const { id, status, general } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team };
  }
}

class InReviewBuidler {
  static preview(task: Extract<WithoutConflicts, InReview>): PreviewInReview {
    const { id, status, general, reviews } = task;
    const { name, administrator, team } = general;
    return { id, status, name, administrator, team, reviews };
  }
}

function isDraft(
  task: WithoutConflicts,
): task is Extract<WithoutConflicts, Draft> {
  return task.status === DRAFT;
}
