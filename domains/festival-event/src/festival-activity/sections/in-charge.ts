export type Adherent = {
  id: number;
  firstname: string;
  lastname: string;
  nickname?: string;
};

export type Contractor = {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string | null;
  company: string | null;
  comment: string | null;
};

export type InCharge = {
  adherent: Adherent;
  team: string;
  contractors: Contractor[];
};

export type DraftInCharge = Omit<InCharge, "team"> & {
  team: string | null;
};
