import { CreateBarrelTransaction } from "@overbookd/personal-account";
import { CreateProvisionsTransaction } from "@overbookd/personal-account";

export type CreateBarrelTransactionsForm = {
  barrelSlug: string;
  transactions: CreateBarrelTransaction[];
};

export type CreateProvisionsTransactionsForm = {
  stickPrice: number;
  transactions: CreateProvisionsTransaction[];
};
