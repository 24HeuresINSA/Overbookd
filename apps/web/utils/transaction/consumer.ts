import type { Consumer } from "@overbookd/http";

export type ConsumerWithConsumption = Consumer & {
  newConsumption: number;
};
