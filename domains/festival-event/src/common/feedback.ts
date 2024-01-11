import { Adherent } from "./adherent";

export type Feedback = {
  content: string;
  publishedAt: Date;
  author: Adherent;
};
