import { ElectricityConnection } from "@overbookd/festival-event-constants";

export type ElectricitySupply = {
  id: string;
  connection: ElectricityConnection;
  device: string;
  power: number;
  count: number;
  comment: string | null;
};

export type Supply = {
  electricity: ElectricitySupply[];
  water: string | null;
};
