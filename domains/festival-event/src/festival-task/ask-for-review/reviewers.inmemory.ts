import { Reviewers, ReviewerStat } from "./ask-for-review.js";

export class InMemoryReviewers implements Reviewers {
  constructor(private readonly stats: ReviewerStat[] = []) {}

  getAll(): Promise<ReviewerStat[]> {
    return Promise.resolve(this.stats);
  }
}
