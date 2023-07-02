const REFUSED = 'REFUSED';
const SUBMIT = 'SUBMIT';
const VALIDATED = 'VALIDATED';
const COMMENT = 'COMMENT';
const READY = 'READY';

export const ftFeedbackSubjectType: Record<
  FtFeedbackSubjectType,
  FtFeedbackSubjectType
> = {
  REFUSED,
  SUBMIT,
  VALIDATED,
  COMMENT,
  READY,
};

export type FtFeedbackSubjectType =
  | typeof REFUSED
  | typeof SUBMIT
  | typeof VALIDATED
  | typeof COMMENT
  | typeof READY;

export class FtFeedbackAuthor {
  firstname: string;
  lastname: string;
}

export class FtFeedbackResponse {
  id: number;
  author: FtFeedbackAuthor;
  comment: string;
  subject: FtFeedbackSubjectType;
  createdAt: Date;
}
