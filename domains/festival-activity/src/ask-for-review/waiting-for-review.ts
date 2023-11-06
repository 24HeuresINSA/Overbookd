export const comcom = "comcom";
export const humain = "humain";
export const signa = "signa";
export const secu = "secu";
export const matos = "matos";
export const elec = "elec";
export const barrieres = "barrieres";

export type PrivateActivityReviewer =
  | typeof humain
  | typeof signa
  | typeof secu
  | typeof matos
  | typeof elec
  | typeof barrieres;

export type PublicActivityReviewer = PrivateActivityReviewer | typeof comcom;

export type Reviewer = PublicActivityReviewer | PrivateActivityReviewer;

export type WaitingForReview = {
  id: number;
  name: string;
  reviewers: Reviewer[];
};
