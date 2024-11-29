import type { Consumer } from "@overbookd/http";

export type ConsumerWithAmount = Consumer & {
  amount: number;
};
