import { HttpStringified } from "../types/http";
import { FaFeedback } from "./feedback";
import { FtSimplified } from "./ft";
import { StoredGearRequest } from "./gearRequests";
import { PeriodWithId } from "./period";
import { SignaLocation } from "./signaLocation";
import { Team } from "./team";
import { DisplayedUser, User } from "./user";

export enum FaStatus {
  DRAFT = "DRAFT",
  REFUSED = "REFUSED",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
}

export enum FaStatusLabel {
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
  DIVERTISSEMENT = "Divertissement",
  CULTURE = "Culture",
  SPORT = "Sport",
  ENFANT = "Enfant",
  AUTRE = "Autre",
}

export interface BaseFa {
  id: number;
  name: string;
  status: FaStatus;
}

export interface Fa extends BaseFa {
  description: string;
  type?: FaType;
  team?: Team;
  userInCharge?: User;
  location?: SignaLocation;
  securityNeed?: string;
  numberOfPass?: number;
  waterNeed?: string;
  collaborator?: Collaborator;
  electricityNeeds: FaElectricityNeed[];
  signaNeeds: FaSignaNeed[];
  faValidation: FaReview[];
  faRefuse: FaReview[];
  feedbacks: FaFeedback[];
  timeWindows: FaTimeWindow[];
  faSitePublishAnimation?: SitePublishAnimation;
  fts: FtSimplified[];
}

export type FaSimplified = Pick<
  Fa,
  | "id"
  | "name"
  | "status"
  | "userInCharge"
  | "team"
  | "faValidation"
  | "faRefuse"
>;

export type CreateFa = Pick<Fa, "name">;

export interface FaGeneralUpdate
  extends Pick<
    Fa,
    "id" | "name" | "description" | "type" | "securityNeed" | "waterNeed"
  > {
  teamId: number | null;
  userInChargeId: number | null;
  locationId: number | null;
  numberOfPass: number | null;
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

interface FaReview {
  user: DisplayedUser;
  team: Team;
}

export type FaValidation = FaReview;

export type FaRefuse = FaReview;

export interface FaElectricityNeed {
  id?: number;
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
  start: Date;
  end: Date;
}

export interface FaTimeWindowWithType extends FaTimeWindow {
  type: TimeWindowType;
}

export interface FaValidationBody {
  teamId: number;
}

export interface SearchFa {
  isDeleted?: boolean;
  status?: FaStatus;
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

export type FaTimeWindowSortFunction = (
  timeWindows: FaTimeWindow[],
  desc: boolean
) => FaTimeWindow[];

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
  const timeWindows = fa.timeWindows?.map(castFaTimeWindowWithDate) ?? [];
  const feedbacks = fa.feedbacks?.map(castFeedbackWithDate) ?? [];
  return {
    ...fa,
    timeWindows,
    feedbacks,
  };
}

export function castFaTimeWindowWithDate(
  timeWindow: HttpStringified<FaTimeWindow>
): FaTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

function castFeedbackWithDate(
  feedback: HttpStringified<FaFeedback>
): FaFeedback {
  const createdAt = new Date(feedback.createdAt);
  return {
    ...feedback,
    createdAt: createdAt,
  };
}

export function simplifyCompleteFa({
  id,
  name,
  status,
  userInCharge,
  team,
  faValidation,
  faRefuse,
}: Fa): FaSimplified {
  return {
    id,
    name,
    status,
    userInCharge,
    team,
    faValidation,
    faRefuse,
  };
}

export function toUpdateFa({
  id,
  name,
  description,
  type,
  userInCharge,
  team,
  location,
  securityNeed,
  numberOfPass,
  waterNeed,
}: Fa): HttpStringified<FaGeneralUpdate> {
  return {
    id,
    name,
    description,
    type,
    userInChargeId: userInCharge?.id ?? null,
    teamId: team?.id ?? null,
    locationId: location?.id ?? null,
    securityNeed,
    numberOfPass: numberOfPass ?? null,
    waterNeed,
  };
}
