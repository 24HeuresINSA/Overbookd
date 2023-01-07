export interface FormComment {
  // called FormComment because typescript already has a Comment class
  id?: number;
  comment: string;
  subject: SubjectType;
  created_at?: Date;
  author: number;
  User_author?: {
    firstname: string;
    lastname: string;
  };
}

export interface FormCommentUpdate {
  id?: number;
  comment: string;
  subject: SubjectType;
  created_at?: Date;
  author: number;
}

export enum SubjectType {
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
  READY = "READY",
}
