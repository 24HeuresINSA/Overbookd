export interface FormComment {
  // called FormComment because typescript already has a Comment class
  topic: string;
  text: string;
  time: Date;
  validator?: string;
}
