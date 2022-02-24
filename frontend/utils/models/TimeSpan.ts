export interface TimeSpan {
  start: Date;
  end: Date;
  timeframeID: string;
  assigned: string;
  required: {
    _id: string;
    type: "team" | "user";
    amount: number;
    user?: {
      _id: string;
      name: string;
    };
  };
}
