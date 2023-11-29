import {
  DRAFT,
  FestivalActivity,
  IN_REVIEW,
} from "@overbookd/festival-activity";

export const BROUILLON = "Brouillon";
const SOUMISE_A_VALIDATION = "Soumise à validation";

export type FaStatusLabel = typeof BROUILLON | typeof SOUMISE_A_VALIDATION;

export const faStatusLabels = new Map<
  FestivalActivity["status"],
  FaStatusLabel
>([
  [DRAFT, BROUILLON],
  [IN_REVIEW, SOUMISE_A_VALIDATION],
]);

export const activityCategories = [
  "Divertissement",
  "Culture",
  "Sport",
  "Enfant",
  "Autre",
];
