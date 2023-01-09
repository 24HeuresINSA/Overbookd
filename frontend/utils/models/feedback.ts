import { DisplayedUser } from "./user";

export interface Feedback {
  comment: string;
  subject: SubjectType;
  createdAt: Date;
  author: DisplayedUser;
}

export interface SavedFeedback extends Feedback {
  id: number;
}

export interface FeedbackCreation extends Omit<Feedback, "author"> {
  author: number;
}

export enum SubjectType {
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
  READY = "READY",
}
