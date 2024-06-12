import { Adherent } from "./adherent.js";

export type Feedback = {
  content: string;
  publishedAt: Date;
  author: Adherent;
};
