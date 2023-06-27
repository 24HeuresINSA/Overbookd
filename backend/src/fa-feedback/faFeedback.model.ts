const REFUSED = 'REFUSED';
const SUBMIT = 'SUBMIT';
const VALIDATED = 'VALIDATED';
const COMMENT = 'COMMENT';

export const faFeedbackSubjectType: Record<
  FaFeedbackSubjectType,
  FaFeedbackSubjectType
> = {
  REFUSED,
  SUBMIT,
  VALIDATED,
  COMMENT,
};

export type FaFeedbackSubjectType =
  | typeof REFUSED
  | typeof SUBMIT
  | typeof VALIDATED
  | typeof COMMENT;

export class FaFeedbackAuthor {
  firstname: string;
  lastname: string;
}

export class FaFeedbackResponse {
  id: number;
  author: FaFeedbackAuthor;
  comment: string;
  subject: FaFeedbackSubjectType;
  createdAt: Date;
}
