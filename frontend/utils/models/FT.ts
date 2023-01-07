import { FormComment } from "./Comment";

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
  ft_validation?: FTValidation[];
  ft_refuse?: FTValidation[];
  ft_comments?: FormComment[];
}

export type CreateFT = Pick<FT, "name">;

export interface SearchFT {
  isDeleted?: boolean;
  status?: FTStatus;
}

export interface FTValidation {
  User: {
    firstname: string;
    lastname: string;
  };
  Team: {
    id: number;
    name: string;
    color: string;
    icon: string;
  };
}
