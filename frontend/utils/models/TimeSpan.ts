export interface TimeSpan {
  FTID: number;
  start: Date;
  end: Date;
  timeframeID: string;
  assigned: string;
  required: string;
  _id: string;
}

enum TimeSpanCategory {
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
