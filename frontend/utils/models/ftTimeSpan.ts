export enum TimeSpanCategory {
  STATIQUE = "STATIQUE",
  BAR = "BAR",
  MANUTENTION = "MANUTENTION",
  ANIMATION = "ANIMATION",
  NETTOYAGE = "NETTOYAGE",
}

export interface TimeSpanParameters {
  hasPriority: boolean;
  category: TimeSpanCategory;
}
