export enum Status {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}

export enum ElectricityType {
  PC16 = "PC16",
  P17_16A_MONO = "P17 16A MONO",
  P17_16A_TRI = "P17 16A TRI",
  P17_16A_TETRA = "P17 16A TETRA",
  P17_32A_MONO = "P17 32A MONO",
  P17_32A_TRI = "P17 32A TRI",
  P17_32A_TETRA = "P17 32A TETRA",
}

export enum SignaType {
  BANNIERE = "BANNIERE",
  PANNEAU = "PANNEAU",
  PANCARTE = "PANCARTE",
}

export enum CommentType {
  COMMENT = "Commentaire",
  SUBMIT = "Soumise à validation",
  VALIDATION = "Validation",
  REFUSAL = "Refus",
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
  fa_comment?: fa_comment[];
  fa_signa_needs?: fa_signa_needs[];
}

export interface fa_collaborator {
  fa_id: number;
  collaborator_id?: number;
  is_deleted?: boolean;
  collaborator: collaborator;
}

export interface collaborator {
  id?: number;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  company?: string;
  comment?: string;
}

export interface fa_electricity_needs {
  id?: number;
  fa_id: number;
  electricity_type: ElectricityType;
  power: number;
  comment?: string;
}

export interface fa_comment {
  id?: number;
  fa_id: number;
  subject: CommentType;
  comment: string;
  author: number;
  created_at: Date;
  team_id?: number;
}

export interface fa_signa_needs {
  id?: number;
  fa_id: number;
  type: SignaType;
  text: string;
  count: number;
  comment?: string;
}
