import { Gear } from "./catalog.model";

export enum Status {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
}
export enum electricity_type {
  PC16 = "PC16",
  P17_16A_MONO = "P17_16A_MONO",
  P17_16A_TRI = "P17_16A_TRI",
  P17_32A_MONO = "P17_32A_MONO",
  P17_32A_TRI = "P17_32A_TRI",
  P17_32A_TETRA = "P17_32A_TETRA",
}

export enum signa_type {
  BANNIERE = "BANNIERE",
  PANNEAU = "PANNEAU",
  PANCARTE = "PANCARTE",
}
export enum subject_type {
  REFUSED = "REFUSED",
  VALIDATED = "VALIDATED",
  COMMENT = "COMMENT",
  SUBMIT = "SUBMIT",
}

export enum fa_type {
  Concert = "Concert",
  Course = "Course",
  Divertissement = "Divertissement",
  Initiation = "Initiation",
  Tournoi = "Tournoi",
  Vente = "Vente",
  Prevention = "Prevention",
  Spectacle = "Spectacle",
  Autre = "Autre",
}
export enum time_windows_type {
  ANIM = "ANIM",
  MATOS = "MATOS",
}

export interface FA {
  id: number;
  name: string;
  type?: fa_type;
  team_id?: number;
  in_charge?: number;
  created_at?: Date;
  location_id?: number;
  status: Status;
  description?: string;
  photo_link?: string;
  is_publishable?: boolean;
  is_major?: boolean;
  is_kids?: boolean;
  security_needs?: boolean;
  is_pass_required?: boolean;
  number_of_pass?: number;
  water_needs?: string;
  water_flow_required?: string;
  is_deleted?: boolean;
  fa_collaborators?: fa_collaborators[];
  fa_validation?: fa_validation[];
  fa_refuse?: fa_refuse[];
  fa_electricity_needs?: fa_electricity_needs[];
  fa_signa_needs?: fa_signa_needs[];
  fa_comments?: fa_comments[];
  time_windows?: time_windows[];
}

export interface fa_collaborators {
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

export interface fa_validation {
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

export interface fa_refuse {
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

export interface fa_electricity_needs {
  id?: number;
  fa_id: number;
  electricity_type: electricity_type;
  power: number;
  comment?: string;
}

export interface fa_signa_needs {
  id?: number;
  signa_type: signa_type;
  text: string;
  count: number;
  comment?: string;
}

export interface fa_comments {
  id?: number;
  comment: string;
  subject: subject_type;
  created_at?: Date;
  author: number;
  User_author?: {
    firstname: string;
    lastname: string;
  };
}

export interface fa_comments_update {
  id?: number;
  comment: string;
  subject: subject_type;
  created_at?: Date;
  author: number;
}

export interface time_windows {
  id?: number;
  type: time_windows_type;
  start: Date;
  end: Date;
}

export interface fa_general_update {
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
}

export interface fa_validation_body {
  team_id: number;
}

export interface GearRequestCreation {
  gearId: number;
  quantity: number;
  start: Date;
  end: Date;
}

export interface GearRequest {
  rentalPeriod: {
    start: Date;
    end: Date;
  };
  quantity: number;
  gear: Gear;
}
