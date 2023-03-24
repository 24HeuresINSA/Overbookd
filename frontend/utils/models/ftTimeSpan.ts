export enum TimeSpanCategory {
  STATIQUE = "STATIQUE",
  BAR = "BAR",
  MANUTENTION = "MANUTENTION",
  ANIMATION = "ANIMATION",
  NETTOYAGE = "NETTOYAGE",
  AUTRE = "AUTRE",
}

export interface TimeSpanParameters {
  hasPriority: boolean;
  category?: TimeSpanCategory;
}
