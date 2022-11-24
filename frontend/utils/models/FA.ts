export enum Status {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}

export enum ElectricityType {
  ELECTRICITY = "ELECTRICITY",
  GAS = "GAS",
  WATER = "WATER",
  OTHER = "OTHER",
}

export enum SignaType {
  BANNIERE = "BANNIERE",
  PANNEAU = "PANNEAU",
  PANCARTE = "PANCARTE",
}

export enum CommentType {
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
  VALIDATION = "VALIDATION",
  REFUSAL = "REFUSAL"
}

export interface FA {
  id?: number;
  name: string;
  type?: string;
  team_id?: number;
  in_charge?: number;
  created_at?: Date;
  location_id?: number;
  status: Status;
  description?: string;
  is_publishable?: boolean;
  is_major?: boolean;
  is_kids?: boolean;
  security_needs?: boolean;
  is_pass_required?: boolean;
  number_of_pass?: number;
  water_needs?: string;
  water_flow_required?: string;
  is_deleted?: boolean;
  fa_collaborator?: fa_collaborator[];
  fa_electricity_needs?: fa_electricity_needs[];
}

export interface fa_collaborator {
  fa_id: number;
  collaborator_id: number;
  is_deleted: boolean;
  collaborator: collaborator;
}

export interface collaborator {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email?: string;
  company?: string;
  comment?: string;
}

export interface fa_electricity_needs {
  id: number;
  fa_id: number;
  electricity_type: ElectricityType;
  power: number;
  comment?: string;
}

export interface fa_comment {
  id: number;
  fa_id: number;
  subject: CommentType;
  comment: string;
  author: number;
  created_at: Date;
  team_id?: number;
}
