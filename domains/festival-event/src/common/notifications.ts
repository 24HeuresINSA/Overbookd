import { FestivalEventIdentifier } from "./festival-event.js";
import { Reviewer } from "./review.js";

export type WaitingForReview<T extends FestivalEventIdentifier> = {
  id: number;
  name: string;
  reviewers: Reviewer<T>[];
};

export type Notifyee<T extends FestivalEventIdentifier> = { team: Reviewer<T> };

export type Notifications<T extends FestivalEventIdentifier = "FA"> = {
  add(event: WaitingForReview<T>): Promise<Notifyee<T>[]>;
};
