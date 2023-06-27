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

export enum ElectricityType {
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

export enum ElectricityTypeLabel {
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

export enum SignaType {
  BANNIERE = "BANNIERE",
  PANNEAU = "PANNEAU",
  PANCARTE = "PANCARTE",
}

export enum FaType {
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
export enum TimeWindowType {
  ANIM = "ANIM",
  MATOS = "MATOS",
}

export enum FaCardType {
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

export interface FaSimplified {
  id: number;
  name: string;
  status: Status;
}

export interface Fa extends FaSimplified {
  type?: FaType;
  teamId?: number;
  userInChargeId?: number;
  createdAt?: Date;
  locationId?: number;
  description?: string;
  securityNeed?: string;
  isPassRequired?: boolean;
  numberOfPass?: number;
  waterNeed?: string;
  waterFlowRequired?: string;
  isDeleted?: boolean;
  faCollaborators?: FaCollaborator[];
  faValidation?: FaValidation[];
  faRefuse?: FaRefuse[];
  faElectricityNeeds?: FaElectricityNeed[];
  faSignaNeeds?: FaSignaNeed[];
  faFeedbacks?: FaFeedback[];
  timeWindows?: FaTimeWindow[];
  faSitePublishAnimation?: SitePublishAnimation;
  fts: FTSimplified[];
}

export type CreateFa = Pick<Fa, "name">;

export interface FaCollaborator {
  collaborator: Collaborator;
}

export interface Collaborator {
  id?: number;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  company?: string;
  comment?: string;
}

export interface FaFeedback {
  id?: number;
  comment: string;
  subject: SubjectType;
  createdAt?: Date;
  author?: DisplayedUser;
  authorId?: number;
}

interface FaReview {
  user: DisplayedUser;
  team: Team;
}

export type FaValidation = FaReview;

export type FaRefuse = FaReview;

export interface FaElectricityNeed {
  id?: number;
  faId?: number;
  electricityType: ElectricityType;
  device?: string;
  power: number;
  count?: number;
  comment?: string;
}

export interface FaSignaNeed {
  id?: number;
  signaType: SignaType;
  text: string;
  count: number;
  comment?: string;
}

export interface FaSignaNeedsExportCsv extends Omit<FaSignaNeed, "id"> {
  faName: string;
  faId: number;
}

export interface FaTimeWindow {
  id?: number;
  type: TimeWindowType;
  start: Date;
  end: Date;
}

export interface FaGeneralUpdate {
  name: string;
  type?: string;
  teamId?: number;
  userInChargeId?: number;
  createdAt?: Date;
  locationId?: number;
  status: Status;
  description?: string;
  isPublishable?: boolean;
  securityNeed?: string;
  isPassRequired?: boolean;
  numberOfPass?: number;
  waterNeed?: string;
  waterFlowRequired?: string;
  isDeleted?: boolean;
}

export interface FaValidationBody {
  teamId: number;
}

export interface SearchFa {
  isDeleted?: boolean;
  status?: Status;
}

export interface FaPageId {
  id: number;
}

export interface SitePublishAnimationCreation {
  faId: number;
}

export interface SitePublishAnimation {
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
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

export interface ElectricityTypeWithLabel {
  type: ElectricityType;
  label: ElectricityTypeLabel;
}

export interface SortedStoredGearRequests {
  matos: StoredGearRequest<"FA">[];
  barrieres: StoredGearRequest<"FA">[];
  elec: StoredGearRequest<"FA">[];
}

export function castFaWithDate(fa: HttpStringified<Fa>): Fa {
  const timeWindows = fa.timeWindows?.map(castTimeWindowWithDate);
  const createdAt = fa.createdAt ? new Date(fa.createdAt) : undefined;
  const faFeedbacks = fa.faFeedbacks?.map(castCommentWithDate);
  return {
    ...fa,
    createdAt,
    timeWindows,
    faFeedbacks,
  };
}

function castCommentWithDate(comment: HttpStringified<FaFeedback>): FaFeedback {
  const createdAt = comment.createdAt ? new Date(comment.createdAt) : undefined;
  return {
    ...comment,
    createdAt: createdAt,
  };
}

function castTimeWindowWithDate(
  timeWindow: HttpStringified<FaTimeWindow>
): FaTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}
