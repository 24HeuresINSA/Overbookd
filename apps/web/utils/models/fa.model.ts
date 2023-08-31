import { HttpStringified } from "../types/http";
import { FaFeedback } from "./feedback.model";
import { FtSimplified } from "./ft.model";
import { StoredGearRequest } from "./gear-request.model";
import { PeriodWithId } from "./period.model";
import { SignaLocation } from "./signa-location.model";
import { Team } from "./team.model";
import { User } from "@overbookd/user";

export enum FaStatus {
  DRAFT = "DRAFT",
  REFUSED = "REFUSED",
  SUBMITTED = "SUBMITTED",
  VALIDATED = "VALIDATED",
}

export const BROUILLON = "Brouillon";
const REFUSEE = "Refusée";
const SOUMISE_A_VALIDATION = "Soumise à validation";
const VALIDEE = "Validée";
const A_VALIDER = "À valider";

export type FaStatusLabel =
  | typeof BROUILLON
  | typeof REFUSEE
  | typeof SOUMISE_A_VALIDATION
  | typeof VALIDEE;

export const faStatusLabels = new Map<FaStatus, FaStatusLabel>([
  [FaStatus.DRAFT, BROUILLON],
  [FaStatus.REFUSED, REFUSEE],
  [FaStatus.SUBMITTED, SOUMISE_A_VALIDATION],
  [FaStatus.VALIDATED, VALIDEE],
]);

export enum ValidatorStatus {
  VALIDATED = "VALIDATED",
  REFUSED = "REFUSED",
  TO_VALIDATE = "TO_VALIDATE",
}

export type ValidatorStatusLabel =
  | typeof VALIDEE
  | typeof REFUSEE
  | typeof A_VALIDER;

export const validatorStatusLabels = new Map<
  ValidatorStatus,
  ValidatorStatusLabel
>([
  [ValidatorStatus.VALIDATED, VALIDEE],
  [ValidatorStatus.REFUSED, REFUSEE],
  [ValidatorStatus.TO_VALIDATE, A_VALIDER],
]);

const PC16_Prise_classique = "PC16_Prise_classique";
const P17_16A_MONO = "P17_16A_MONO";
const P17_16A_TRI = "P17_16A_TRI";
const P17_16A_TETRA = "P17_16A_TETRA";
const P17_32A_MONO = "P17_32A_MONO";
const P17_32A_TRI = "P17_32A_TRI";
const P17_32A_TETRA = "P17_32A_TETRA";
const P17_63A_MONO = "P17_63A_MONO";
const P17_63A_TRI = "P17_63A_TRI";
const P17_63A_TETRA = "P17_63A_TETRA";
const P17_125A_TETRA = "P17_125A_TETRA";

export type ElectricityType =
  | typeof PC16_Prise_classique
  | typeof P17_16A_MONO
  | typeof P17_16A_TRI
  | typeof P17_16A_TETRA
  | typeof P17_32A_MONO
  | typeof P17_32A_TRI
  | typeof P17_32A_TETRA
  | typeof P17_63A_MONO
  | typeof P17_63A_TRI
  | typeof P17_63A_TETRA
  | typeof P17_125A_TETRA;

export const electricityTypeLabels = new Map<ElectricityType, string>([
  [PC16_Prise_classique, "Prise classique (PC16)"],
  [P17_16A_MONO, "16A Mono (P17 16A MONO)"],
  [P17_16A_TRI, "16A Tri (P17 16A TRI)"],
  [P17_16A_TETRA, "16A Tetra (P17 16A TETRA)"],
  [P17_32A_MONO, "32A Mono (P17 32A MONO)"],
  [P17_32A_TRI, "32A Tri (P17 32A TRI)"],
  [P17_32A_TETRA, "32A Tetra (P17 32A TETRA)"],
  [P17_63A_MONO, "63A Mono (P17 63A MONO)"],
  [P17_63A_TRI, "63A Tri (P17 63A TRI)"],
  [P17_63A_TETRA, "63A Tetra (P17 63A TETRA)"],
  [P17_125A_TETRA, "125A Tetra (P17 125A TETRA)"],
]);

export enum SignaType {
  BACHE = "BACHE",
  PANNEAU = "PANNEAU",
  AFFICHE = "AFFICHE",
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

export const publicAnimationCategoryTypes = {
  DIVERTISSEMENT: "Divertissement",
  CULTURE: "Culture",
  SPORT: "Sport",
  ENFANT: "Enfant",
  AUTRE: "Autre",
};

export type PublicAnimationCategoryType =
  keyof typeof publicAnimationCategoryTypes;

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
  publicAnimation?: PublicAnimation;
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
  teamCode: string | null;
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
  user: User;
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
  size?: string;
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
  teamCode: number;
}

export interface SearchFa {
  isDeleted?: boolean;
  status?: FaStatus;
}

export interface FaPageId {
  id: number;
}

export interface PublicAnimationCreation {
  faId: number;
}

export interface PublicAnimation {
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
  categories?: PublicAnimationCategoryType[];
}

export interface PublicAnimationWithFa extends Required<PublicAnimation> {
  fa: {
    id: number;
    name: string;
    timeWindows: PeriodWithId[];
  };
}

export type FaTimeWindowSortFunction = (
  timeWindows: FaTimeWindow[],
  desc: boolean,
) => FaTimeWindow[];

export interface ElectricityTypeWithLabel {
  type: ElectricityType;
  label: string;
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
  timeWindow: HttpStringified<FaTimeWindow>,
): FaTimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

function castFeedbackWithDate(
  feedback: HttpStringified<FaFeedback>,
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
    teamCode: team?.code ?? null,
    locationId: location?.id ?? null,
    securityNeed,
    numberOfPass: numberOfPass ?? null,
    waterNeed,
  };
}
