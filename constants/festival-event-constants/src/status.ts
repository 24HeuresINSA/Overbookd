export const DRAFT = "DRAFT";
export const IN_REVIEW = "IN_REVIEW";
export const VALIDATED = "VALIDATED";
export const REFUSED = "REFUSED";
export const READY_TO_ASSIGN = "READY_TO_ASSIGN";

export type Status =
  | typeof DRAFT
  | typeof IN_REVIEW
  | typeof VALIDATED
  | typeof REFUSED
  | typeof READY_TO_ASSIGN;

export const BROUILLON = "Brouillon";
export const RELECTURE_EN_COURS = "Relecture en cours";
export const VALIDEE = "Validée";
export const REFUSEE = "Refusée";
export const PRETE_POUR_AFFECTATION = "Prête pour affectation";

export type StatusLabel =
  | typeof BROUILLON
  | typeof RELECTURE_EN_COURS
  | typeof VALIDEE
  | typeof REFUSEE
  | typeof PRETE_POUR_AFFECTATION;

export const statusLabels = new Map<Status, StatusLabel>([
  [DRAFT, BROUILLON],
  [IN_REVIEW, RELECTURE_EN_COURS],
  [REFUSED, REFUSEE],
  [VALIDATED, VALIDEE],
  [READY_TO_ASSIGN, PRETE_POUR_AFFECTATION],
]);
