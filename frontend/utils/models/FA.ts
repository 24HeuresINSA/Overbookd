import { HttpStringified } from "../types/http";
import { SubjectType } from "./feedback";
import { FTSimplified } from "./ft";
import { StoredGearRequest } from "./gearRequests";
import { PeriodWithId } from "./period";
import { Team } from "./team";
import { DisplayedUser } from "./user";

export enum Status {
  DRAFT = "DRAFT",
  REFUSED = "REFUSED",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
}

export enum FAStatusLabel {
  DRAFT = "Brouillon",
  REFUSED = "Refusée",
  SUBMITTED = "Soumise à validation",
  VALIDATED = "Validée",
}

export enum electricity_type {
  PC16 = "PC16_Prise_classique",
  P17_16A_MONO = "P17_16A_MONO",
  P17_16A_TRI = "P17_16A_TRI",
  P17_16A_TETRA = "P17_16A_TETRA",
  P17_32A_MONO = "P17_32A_MONO",
  P17_32A_TRI = "P17_32A_TRI",
  P17_32A_TETRA = "P17_32A_TETRA",
  P17_63A_MONO = "P17_63A_MONO",
  P17_63A_TRI = "P17_63A_TRI",
  P17_63A_TETRA = "P17_63A_TETRA",
  P17_125A_TETRA = "P17_125A_TETRA",
}

export enum electricity_type_label {
  PC16_Prise_classique = "Prise classique (PC16)",
  P17_16A_MONO = "16A Mono (P17_16A_MONO)",
  P17_16A_TRI = "16A Tri (P17_16A_TRI)",
  P17_16A_TETRA = "16A Tetra (P17_16A_TETRA)",
  P17_32A_MONO = "32A Mono (P17_32A_MONO)",
  P17_32A_TRI = "32A Tri (P17_32A_TRI)",
  P17_32A_TETRA = "32A Tetra (P17_32A_TETRA)",
  P17_63A_MONO = "63A Mono (P17_63A_MONO)",
  P17_63A_TRI = "63A Tri (P17_63A_TRI)",
  P17_63A_TETRA = "63A Tetra (P17_63A_TETRA)",
  P17_125A_TETRA = "125A Tetra (P17_125A_TETRA)",
}

export enum signa_type {
  BANNIERE = "BANNIERE",
  PANNEAU = "PANNEAU",
  PANCARTE = "PANCARTE",
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

export enum fa_card_type {
  GENERAL = "GENERAL",
  DETAIL = "DETAIL",
  SIGNA = "SIGNA",
  TIME_WINDOW = "TIME_WINDOW",
  SECURITY = "SECURITY",
  COLLABORATOR = "COLLABORATOR",
  LOGISTICS = "LOGISTICS",
  ELEC = "ELEC",
  WATER = "WATER",
}

export enum SitePublishAnimationCategoryType {
  Divertissement = "Divertissement",
  Culture = "Culture",
  Sport = "Sport",
  Enfant = "Enfant",
  Autre = "Autre",
}

export interface FASimplified {
  id: number;
  name: string;
  status: Status;
}

export interface FA extends FASimplified {
  type?: fa_type;
  team_id?: number;
  in_charge?: number;
  created_at?: Date;
  location_id?: number;
  description?: string;
  security_needs?: string;
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
  faSitePublishAnimation?: SitePublishAnimation;
  fts: FTSimplified[];
}

export type CreateFA = Pick<FA, "name">;

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

export interface fa_comments {
  id?: number;
  comment: string;
  subject: SubjectType;
  created_at?: Date;
  author: number;
  User_author?: DisplayedUser;
}

interface FAReview {
  User: DisplayedUser;
  Team: Team;
}

export type fa_validation = FAReview;

export type fa_refuse = FAReview;

export interface fa_electricity_needs {
  id?: number;
  fa_id?: number;
  electricity_type: electricity_type;
  device?: string;
  power: number;
  count?: number;
  comment?: string;
}

export interface fa_signa_needs {
  id?: number;
  signa_type: signa_type;
  text: string;
  count: number;
  comment?: string;
}

export interface FaSignaNeedsExportCsv extends Omit<fa_signa_needs, "id"> {
  fa_name: string;
  fa_id: number;
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
  security_needs?: string;
  is_pass_required?: boolean;
  number_of_pass?: number;
  water_needs?: string;
  water_flow_required?: string;
  is_deleted?: boolean;
}

export interface fa_validation_body {
  team_id: number;
}

export interface SearchFA {
  isDeleted?: boolean;
  status?: Status;
}

export interface FAPageId {
  id: number;
}

export interface SitePublishAnimationCreation {
  faId: number;
}

export interface SitePublishAnimation {
  photoLink?: string;
  description?: string;
  isMajor?: boolean;
  categories?: SitePublishAnimationCategoryType[];
}

export interface SitePublishAnimationWithFa
  extends Required<SitePublishAnimation> {
  fa: {
    id: number;
    name: string;
    timeWindows: PeriodWithId[];
  };
}

export interface ElectricityTypeLabel {
  type: electricity_type;
  label: electricity_type_label;
}

export interface SortedStoredGearRequests {
  matos: StoredGearRequest<"FA">[];
  barrieres: StoredGearRequest<"FA">[];
  elec: StoredGearRequest<"FA">[];
}

export function castFaWithDate(fa: HttpStringified<FA>): FA {
  const timeWindows = fa.time_windows?.map(castTimeWindowWithDate);
  const created_at = fa.created_at ? new Date(fa.created_at) : undefined;
  const faComments = fa.fa_comments?.map(castCommentWithDate);
  return {
    ...fa,
    created_at,
    time_windows: timeWindows,
    fa_comments: faComments,
  };
}

function castCommentWithDate(
  comment: HttpStringified<fa_comments>
): fa_comments {
  const createdAt = comment.created_at
    ? new Date(comment.created_at)
    : undefined;
  return {
    ...comment,
    created_at: createdAt,
  };
}

function castTimeWindowWithDate(
  timeWindow: HttpStringified<time_windows>
): time_windows {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}
