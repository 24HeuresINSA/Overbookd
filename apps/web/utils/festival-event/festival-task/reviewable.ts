import type { FestivalTaskReadyToAssign } from "@overbookd/festival-event";
import type {
  HttpStringified,
  ReviewableWithConflicts as Reviewable,
} from "@overbookd/http";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { castTimeWindowWithDate } from "../cast-time-windows";

type BeforeAssignment = Exclude<Reviewable, FestivalTaskReadyToAssign>;
type ReadyToAssign = Extract<Reviewable, FestivalTaskReadyToAssign>;

export class CastReviewable {
  static withDate(reviewable: HttpStringified<Reviewable>): Reviewable {
    if (isReadyToAssign(reviewable))
      return CastReadyToAssign.withDate(reviewable);
    return CastBeforeAssignment.withDate(reviewable);
  }
}

class CastBeforeAssignment {
  static withDate(reviewable: HttpStringified<BeforeAssignment>): Reviewable {
    return {
      ...reviewable,
      festivalActivity: activityWithDate(reviewable.festivalActivity),
      mobilizations: this.mobilizationsWithDate(reviewable.mobilizations),
      feedbacks: feedbacksWithDate(reviewable.feedbacks),
      history: historyWithDate(reviewable.history),
    };
  }

  private static mobilizationsWithDate(
    mobilizations: HttpStringified<BeforeAssignment["mobilizations"]>,
  ): BeforeAssignment["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
    }));
  }
}

export class CastReadyToAssign {
  static withDate(reviewable: HttpStringified<ReadyToAssign>): ReadyToAssign {
    return {
      ...reviewable,
      festivalActivity: activityWithDate(reviewable.festivalActivity),
      mobilizations: this.mobilizationsWithDate(reviewable.mobilizations),
      feedbacks: feedbacksWithDate(reviewable.feedbacks),
      history: historyWithDate(reviewable.history),
    };
  }

  private static mobilizationsWithDate(
    mobilizations: HttpStringified<ReadyToAssign["mobilizations"]>,
  ): ReadyToAssign["mobilizations"] {
    return mobilizations.map((mobilization) => ({
      ...mobilization,
      ...castTimeWindowWithDate(mobilization),
      assignments: mobilization.assignments.map((assignment) => ({
        ...assignment,
        ...castTimeWindowWithDate(assignment),
      })),
    }));
  }
}

function activityWithDate(
  festivalActivity: HttpStringified<Reviewable["festivalActivity"]>,
): Reviewable["festivalActivity"] {
  return {
    ...festivalActivity,
    timeWindows: festivalActivity.timeWindows.map(castTimeWindowWithDate),
    inquiry: {
      ...festivalActivity.inquiry,
      timeWindows: festivalActivity.inquiry.timeWindows.map(
        castTimeWindowWithDate,
      ),
    },
  };
}

function feedbacksWithDate(
  feedbacks: HttpStringified<Reviewable["feedbacks"]>,
): Reviewable["feedbacks"] {
  return feedbacks.map((feedback) => ({
    ...feedback,
    publishedAt: new Date(feedback.publishedAt),
  }));
}

function historyWithDate(
  history: HttpStringified<Reviewable["history"]>,
): Reviewable["history"] {
  return history.map((event) => ({ ...event, at: new Date(event.at) }));
}

function isReadyToAssign(
  festivalTask: HttpStringified<Reviewable>,
): festivalTask is HttpStringified<ReadyToAssign> {
  return festivalTask.status === READY_TO_ASSIGN;
}
