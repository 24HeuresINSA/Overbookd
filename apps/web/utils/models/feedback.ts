import { User } from "./user";

export interface Feedback {
  comment: string;
  subject: SubjectType;
  createdAt: Date;
  author: User;
}

export interface SavedFeedback extends Feedback {
  id: number;
}

export interface FeedbackCreation extends Omit<Feedback, "author"> {
  authorId: number;
}

export enum SubjectType {
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
  READY = "READY",
}

export function isSavedFeedback(
  feedback: Feedback | SavedFeedback
): feedback is SavedFeedback {
  return (feedback as SavedFeedback).id !== undefined;
}
