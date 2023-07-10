import { Collaborator } from '../collaborator/collaborator.model';
import { FaFeedbackSubjectType } from '../fa-feedback/faFeedback.model';
import { ElectricityType } from '../fa_electricity_need/faElectricityNeed.model';
import { SignaType } from '../fa_signa_need/faSignaNeed.model';
import { AnimationCategory } from '../fa_site_publish_animation/faSitePublishAnimation.model';
import { FtStatus } from '../ft/ft.model';

const DRAFT = 'DRAFT';
const SUBMITTED = 'SUBMITTED';
const VALIDATED = 'VALIDATED';
const REFUSED = 'REFUSED';

export const faStatuses: Record<FaStatus, FaStatus> = {
  DRAFT,
  SUBMITTED,
  VALIDATED,
  REFUSED,
};

export type FaStatus =
  | typeof DRAFT
  | typeof SUBMITTED
  | typeof VALIDATED
  | typeof REFUSED;

const CONCERT = 'Concert';
const COURSE = 'Course';
const DIVERTISSEMENT = 'Divertissement';
const INITIATION = 'Initiation';
const TOURNOI = 'Tournoi';
const VENTE = 'Vente';
const PREVENTION = 'Prevention';
const SPECTACLE = 'Spectacle';
const AUTRE = 'Autre';

export const faTypes: Record<FaType, FaType> = {
  Concert: CONCERT,
  Course: COURSE,
  Divertissement: DIVERTISSEMENT,
  Initiation: INITIATION,
  Tournoi: TOURNOI,
  Vente: VENTE,
  Prevention: PREVENTION,
  Spectacle: SPECTACLE,
  Autre: AUTRE,
};

export type FaType =
  | typeof CONCERT
  | typeof COURSE
  | typeof DIVERTISSEMENT
  | typeof INITIATION
  | typeof TOURNOI
  | typeof VENTE
  | typeof PREVENTION
  | typeof SPECTACLE
  | typeof AUTRE;

export interface SignaLocation {
  id: number;
  name: string;
}

export class SignaLocationRepresentation implements SignaLocation {
  id: number;
  name: string;
}

interface UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

class UserNameRepresentation implements UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

export interface UserNameWithId extends UserName {
  id: number;
}

export class UserNameWithIdRepresentation
  extends UserNameRepresentation
  implements UserNameWithId
{
  id: number;
}

export interface Team {
  id: number;
  name: string;
  color: string;
  icon: string;
  code: string;
}

export class TeamRepresentation implements Team {
  id: number;
  name: string;
  color: string;
  icon: string;
  code: string;
}

export interface FaElectricityNeed {
  id: number;
  electricityType: ElectricityType;
  device?: string;
  power: number;
  count: number;
  comment?: string;
}

export class FaElectricityNeedRepresentation implements FaElectricityNeed {
  id: number;
  electricityType: ElectricityType;
  device?: string;
  power: number;
  count: number;
  comment?: string;
}

export interface FaSignaNeed {
  id: number;
  signaType: SignaType;
  text: string;
  count: number;
  comment?: string;
}

export class FaSignaNeedRepresentation implements FaSignaNeed {
  id: number;
  signaType: SignaType;
  text: string;
  count: number;
  comment?: string;
}

export interface FaFeedback {
  comment: string;
  createdAt: Date;
  author: UserName;
  subject: FaFeedbackSubjectType;
}

export class FaFeedbackRepresentation implements FaFeedback {
  comment: string;
  createdAt: Date;
  author: UserNameRepresentation;
  subject: FaFeedbackSubjectType;
}

export interface FaTimeWindow {
  id: number;
  start: Date;
  end: Date;
}

export class FaTimeWindowRepresentation implements FaTimeWindow {
  id: number;
  start: Date;
  end: Date;
}

export interface BaseFt {
  id: number;
  name: string;
  status: FtStatus;
}

export class BaseFtRepresentation implements BaseFt {
  id: number;
  name: string;
  status: FtStatus;
}

export interface FaReview {
  user: UserName;
  team: Team;
}

export class FaReviewRepresentation implements FaReview {
  user: UserNameRepresentation;
  team: TeamRepresentation;
}

export interface FaReviewTeam {
  team: Team;
}

export class FaReviewTeamRepresentation implements FaReviewTeam {
  team: TeamRepresentation;
}

export interface SitePublishAnimation {
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
  categories?: AnimationCategory[];
}

export class SitePublishAnimationRepresentation
  implements SitePublishAnimation
{
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
  categories?: AnimationCategory[];
}

export interface CompleteFaResponse {
  id: number;
  name: string;
  status: FaStatus;
  description: string;
  type?: FaType;
  team?: Team;
  userInCharge?: UserNameWithId;
  location?: SignaLocation;
  securityNeed?: string;
  isPassRequired: boolean;
  numberOfPass?: number;
  waterNeed?: string;
  collaborator?: Collaborator;
  electricityNeeds: FaElectricityNeed[];
  signaNeeds: FaSignaNeed[];
  faValidation: FaReview[];
  faRefuse: FaReview[];
  feedbacks: FaFeedback[];
  timeWindows: FaTimeWindow[];
  faSitePublishAnimation: SitePublishAnimation;
  fts: BaseFt[];
}

export interface LiteFaResponse {
  id: number;
  name: string;
  status: FaStatus;
  isDeleted: boolean;
  team?: Team;
  userInCharge?: UserNameWithId;
  faValidation: FaReviewTeam[];
  faRefuse: FaReviewTeam[];
}
