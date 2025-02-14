import {
  type ElectricityConnection,
  type FestivalActivity,
  P17_125A_TETRA,
  P17_16A_MONO,
  P17_16A_TETRA,
  P17_16A_TRI,
  P17_32A_MONO,
  P17_32A_TETRA,
  P17_32A_TRI,
  P17_63A_MONO,
  P17_63A_TETRA,
  P17_63A_TRI,
  PC16_Prise_classique,
  type PreviewDraft,
  type PreviewFestivalActivity,
} from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  VALIDATED,
  REFUSED,
  BROUILLON,
  RELECTURE_EN_COURS,
  VALIDEE,
  REFUSEE,
} from "@overbookd/festival-event-constants";

export type FaStatusLabel =
  | typeof BROUILLON
  | typeof RELECTURE_EN_COURS
  | typeof VALIDEE
  | typeof REFUSEE;

export const faStatusLabels = new Map<
  FestivalActivity["status"],
  FaStatusLabel
>([
  [DRAFT, BROUILLON],
  [IN_REVIEW, RELECTURE_EN_COURS],
  [VALIDATED, VALIDEE],
  [REFUSED, REFUSEE],
]);

export const activityCategories = [
  "Divertissement",
  "Culture",
  "Sport",
  "Enfant",
  "Autre",
];

export const electricityConnectionLabels = new Map<
  ElectricityConnection,
  string
>([
  [PC16_Prise_classique, "Prise classique (PC16)"],
  [P17_16A_MONO, "16A Mono (P17 16A MONO)"],
  [P17_16A_TRI, "16A Tri (P17 16A TRI)"],
  [P17_16A_TETRA, "16A Tetra (P17 16A TETRA)"],
  [P17_32A_MONO, "32A Mono (P17 32A MONO)"],
  [P17_32A_TRI, "32A Tri (P17 32A TRI)"],
  [P17_32A_TETRA, "32A Tetra (P17 32A TETRA)"],
  [P17_63A_MONO, "63A Mono (P17 63A MONO)"],
  [P17_63A_TRI, "63A Tri (P17 63A TRI)"],
  [P17_63A_TETRA, "63A Tetra (P17 63A TETRA)"],
  [P17_125A_TETRA, "125A Tetra (P17 125A TETRA)"],
]);

export type ElectricityConnectionWithLabel = {
  connection: ElectricityConnection;
  label: string;
};

export function isDraftPreview(
  activity: PreviewFestivalActivity,
): activity is PreviewDraft {
  return activity.status === DRAFT;
}
