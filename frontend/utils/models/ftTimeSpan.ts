export enum TimespanCategory {
  STATIQUE = "STATIQUE",
  BAR = "BAR",
  MANUTENTION = "MANUTENTION",
  ANIMATION = "ANIMATION",
  NETTOYAGE = "NETTOYAGE",
  AUTRE = "AUTRE",
}

export interface TimespanParameters {
  hasPriority: boolean;
  category?: TimespanCategory;
}
