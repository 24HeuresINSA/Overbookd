import { FestivalTask } from "../festival-task";
import {
  Approval,
  NOT_ASKING_TO_REVIEW,
  Rejection,
  Reviewer,
  elec,
  humain,
  matos,
} from "../../common/review";
import { APPROVED, REJECTED } from "../../common/action";
import { REFUSED, VALIDATED } from "../../common/status";
import { FestivalTaskKeyEvents } from "../festival-task.event";
import {
  FestivalTaskTranslator,
  RefusedWithConflicts,
  RefusedWithoutConflicts,
  ReviewableWithoutConflicts,
} from "../volunteer-conflicts";
import { FestivalTaskNotFound } from "../festival-task.error";
import {
  AlreadyApproved,
  NotAskingToReview,
  ShouldAssignDrive,
} from "../../common/review.error";

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
  static from(
    task: ReviewableWithoutConflicts,
    approval: Approval<"FT">,
  ): ReviewableWithoutConflicts {
    const reviews = {
      ...task.reviews,
      [approval.team]: APPROVED,
    };
    const status = Approve.hasAllApproved(reviews) ? VALIDATED : task.status;
    const history = [
      ...task.history,
      FestivalTaskKeyEvents.approved(approval.reviewer),
    ];
    return { ...task, reviews, status, history };
  }

  private static hasAllApproved(
    reviews: ReviewableWithoutConflicts["reviews"],
  ) {
    return Object.values(reviews).every(
      (review) => review === APPROVED || review === NOT_ASKING_TO_REVIEW,
    );
  }
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

  async approve(taskId: FestivalTask["id"], approval: Approval<"FT">) {
    const task = await this.tasks.findById(taskId);
    if (!task) throw new FestivalTaskNotFound(taskId);
    if (task.reviews[approval.team] === NOT_ASKING_TO_REVIEW) {
      throw new NotAskingToReview(task.id, approval.team, "FT");
    }

    if (this.isAlreadyApprovedBy(task, approval.team)) {
      throw new AlreadyApproved(task.id, approval.team, "FT");
    }
    this.checkInquiryDriveAssignment(task);

    const approved = Approve.from(task, approval);
    return this.tasks.save(approved);
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
