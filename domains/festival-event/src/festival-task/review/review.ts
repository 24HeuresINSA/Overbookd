import {
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { FestivalTask, Validated } from "../festival-task.js";
import {
  Approval,
  NOT_ASKING_TO_REVIEW,
  Rejection,
  Reviewer,
  WILL_NOT_REVIEW,
  elec,
  humain,
  matos,
} from "../../common/review.js";
import { APPROVED, REJECTED } from "../../common/action.js";
import { FestivalTaskKeyEvents } from "../festival-task.event.js";
import {
  FestivalTaskTranslator,
  RefusedWithConflicts,
  RefusedWithoutConflicts,
  ReviewableWithoutConflicts,
  ValidatedWithoutConflicts,
} from "../volunteer-conflicts.js";
import {
  CannotIgnoreFestivalTask,
  FestivalTaskNotFound,
} from "../festival-task.error.js";
import {
  AlreadyApproved,
  NotAskingToReview,
  ShouldAssignDrive,
} from "../../common/review.error.js";

export type FestivalTasksForReview = {
  findById(
    ftId: FestivalTask["id"],
  ): Promise<ReviewableWithoutConflicts | null>;

  save<T extends ReviewableWithoutConflicts>(task: T): Promise<T>;
};

class Reject {
  static from(
    task: ReviewableWithoutConflicts,
    rejection: Rejection<"FT">,
  ): RefusedWithoutConflicts {
    const reviews = {
      ...task.reviews,
      [rejection.team]: REJECTED,
    };
    const status = REFUSED;
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.rejected(rejection.rejector, rejection.reason),
    ];
    return { ...task, reviews, status, history };
  }
}

class Approve {
  static from<T extends ReviewableWithoutConflicts>(
    task: T,
    approval: Approval<"FT">,
  ): T | ValidatedWithoutConflicts {
    const reviews = { ...task.reviews, [approval.team]: APPROVED };

    const history = [
      ...task.history,
      FestivalTaskKeyEvents.approved(approval.reviewer),
    ];

    if (hasAllApproved(reviews)) {
      return { ...task, reviews, status: VALIDATED, history };
    }

    return { ...task, reviews, history };
  }
}

class Ignore {
  static from<T extends ReviewableWithoutConflicts>(
    task: T,
    team: Reviewer<"FT">,
  ): T | ReviewableWithoutConflicts | ValidatedWithoutConflicts {
    if (team !== elec) throw new CannotIgnoreFestivalTask();
    // eslint-disable-next-line security/detect-object-injection
    if (task.reviews[elec] === NOT_ASKING_TO_REVIEW) return task;

    const reviews = { ...task.reviews, [elec]: WILL_NOT_REVIEW } as const;

    if (hasAllApproved(reviews)) {
      return { ...task, reviews, status: VALIDATED };
    }
    if (this.hasNoRejected(reviews)) {
      return { ...task, reviews, status: IN_REVIEW };
    }
    return { ...task, reviews };
  }

  private static hasNoRejected(reviews: ReviewableWithoutConflicts["reviews"]) {
    return Object.values(reviews).every((review) => review !== REJECTED);
  }
}

function hasAllApproved(
  reviews: ReviewableWithoutConflicts["reviews"],
): reviews is Validated["reviews"] {
  const validReviews = [APPROVED, NOT_ASKING_TO_REVIEW, WILL_NOT_REVIEW];
  return Object.values(reviews).every((review) =>
    validReviews.includes(review),
  );
}

export class Review {
  constructor(
    private readonly tasks: FestivalTasksForReview,
    private readonly translator: FestivalTaskTranslator,
  ) {}

  async reject(
    taskId: FestivalTask["id"],
    rejection: Rejection<"FT">,
  ): Promise<RefusedWithConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (task.reviews[rejection.team] === NOT_ASKING_TO_REVIEW) {
      throw new NotAskingToReview(task.id, rejection.team, "FT");
    }

    const rejected = await this.tasks.save(Reject.from(task, rejection));
    return this.translator.translate(rejected);
  }

  async approve(
    taskId: FestivalTask["id"],
    approval: Approval<"FT">,
  ): Promise<ReviewableWithoutConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (task.reviews[approval.team] === NOT_ASKING_TO_REVIEW) {
      throw new NotAskingToReview(task.id, approval.team, "FT");
    }

    if (this.isAlreadyApprovedBy(task, approval.team)) {
      throw new AlreadyApproved(task.id, approval.team, "FT");
    }

    if (approval.team === matos) this.checkInquiryDriveAssignment(task);

    const approved = Approve.from(task, approval);
    const saved = await this.tasks.save(approved);
    return this.translator.translate(saved);
  }

  async ignore(
    taskId: FestivalTask["id"],
    team: Reviewer<"FT">,
  ): Promise<ReviewableWithoutConflicts> {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);

    const ignored = Ignore.from(task, team);
    const saved = await this.tasks.save(ignored);
    return this.translator.translate(saved);
  }

  private checkInquiryDriveAssignment(task: ReviewableWithoutConflicts) {
    const areAllRequestsAssignedToDrive = task.inquiries.every((request) =>
      Object.hasOwn(request, "drive"),
    );
    if (!areAllRequestsAssignedToDrive) {
      throw new ShouldAssignDrive("FT");
    }
  }

  private isAlreadyApprovedBy(
    festivalActivity: ReviewableWithoutConflicts,
    team: Reviewer<"FT">,
  ) {
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === APPROVED;
  }
}

function getTeamReview(
  reviews: ReviewableWithoutConflicts["reviews"],
  team: Reviewer<"FT">,
) {
  switch (team) {
    case humain:
      return reviews.humain;
    case matos:
      return reviews.matos;
    case elec:
      return reviews.elec;
  }
}
