import { User } from "./user";

interface BaseFeedback {
  comment: string;
  createdAt: Date;
  author: User;
}
export interface FaFeedback extends BaseFeedback {
  subject: FaFeedbackSubjectType;
}

export interface FtFeedback extends BaseFeedback {
  subject: FtFeedbackSubjectType;
}

export type Feedback = FaFeedback | FtFeedback;

export interface SavedFaFeedback extends FaFeedback {
  id: number;
}

export interface SavedFtFeedback extends FtFeedback {
  id: number;
}

export type SavedFeedback = SavedFaFeedback | SavedFtFeedback;

export interface FeedbackCreation extends Omit<Feedback, "author"> {
  authorId: number;
}

export enum FaFeedbackSubjectType {
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
}

export enum FtFeedbackSubjectType {
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
