type BaseTransaction = {
  amount: number;
  context: string;
  date: Date;
  isDeleted: boolean;
};

export type Barrel = BaseTransaction & {
  type: "BARREL";
  from: string;
  to: null;
};

export type Provisions = BaseTransaction & {
  type: "PROVISIONS";
  from: string;
  to: null;
};

export type Deposit = BaseTransaction & {
  type: "DEPOSIT";
  from: string;
  to: null;
};

export type Transfer = BaseTransaction & {
  type: "TRANSFER";
  from: number;
  to: number;
};

export type Transaction = Barrel | Provisions | Deposit | Transfer;

export const FUT = "Fût";
export const PLACARD = "Placard";
export const DEPOT = "Dépôt";
export const VIREMENT = "Virement";
export const REPAS_PARTAGE = "Repas partagé";
export const INITIALISATION = "Initialisation";
