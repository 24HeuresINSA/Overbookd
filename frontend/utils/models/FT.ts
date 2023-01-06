import { FormComment } from "./Comment";
import { FormValidation } from "./Validation";

export enum FTStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
  READY = "READY",
}

export interface FT {
  id: number;
  name: string;
  status: FTStatus;
  in_charge?: number;
  are_static_time_windows?: boolean;
  locations?: number[];
  fa?: number;
  matos_count?: number;
  description?: string;
  is_deleted?: boolean;
  ft_validation?: FormValidation[];
  ft_refuse?: FormValidation[];
  ft_comments?: FormComment[];
}

export type CreateFT = Pick<FT, "name">;

export interface SearchFT {
  isDeleted?: boolean;
  status?: FTStatus;
}

//////////////////////////////////////////

export type requirement = requirementUser | requirementTeam;

export interface requirementUser {
  type: "user";
  user: {
    _id: string;
    username: string;
  };
}

export interface requirementTeam {
  type: "team";
  team: string;
  amount: number;
}

export interface requirementTeam {
  type: "team";
  team: string;
  amount: number;
}

export enum SmallTypes {
  QUINCAILLERIE = "QUINCAILLERIE",
  OUTILLAGE = "OUTILLAGE",
  CONSUMABLE = "CONSUMABLE",
  PROPRETE = "PROPRETE",
}
