import { FaFeedbackSubjectType } from 'src/fa-feedback/faFeedback.model';
import { ElectricityType } from 'src/fa_electricity_needs/faElectricityNeed.model';
import { SignaType } from 'src/fa_signa_needs/faSignaNeed.model';
import { SitePublishAnimationCategoryType } from 'src/fa_site_publish_animation/sitePublishAnimation.model';
import { FtStatus } from 'src/ft/ft.model';

const DRAFT = 'DRAFT';
const SUBMITTED = 'SUBMITTED';
const VALIDATED = 'VALIDATED';
const REFUSED = 'REFUSED';

export const faStatus: Record<FaStatus, FaStatus> = {
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

const Concert = 'Concert';
const Course = 'Course';
const Divertissement = 'Divertissement';
const Initiation = 'Initiation';
const Tournoi = 'Tournoi';
const Vente = 'Vente';
const Prevention = 'Prevention';
const Spectacle = 'Spectacle';
const Autre = 'Autre';

export const faType: Record<FaType, FaType> = {
  Concert,
  Course,
  Divertissement,
  Initiation,
  Tournoi,
  Vente,
  Prevention,
  Spectacle,
  Autre,
};

export type FaType =
  | typeof Concert
  | typeof Course
  | typeof Divertissement
  | typeof Initiation
  | typeof Tournoi
  | typeof Vente
  | typeof Prevention
  | typeof Spectacle
  | typeof Autre;

export class SignaLocation {
  id: number;
  name: string;
}

class UserName {
  firstname: string;
  lastname: string;
  nickname?: string;
}

export class UserNameWithId extends UserName {
  id: number;
}

export class Team {
  id: number;
  name: string;
  color: string;
  icon: string;
  code: string;
}

export class FaCollaborator {
  id: number;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  company?: string;
  comment?: string;
}

export class FaElectricityNeed {
  id: number;
  electricityType: ElectricityType;
  device?: string;
  power: number;
  count: number;
  comment?: string;
}

export class FaSignaNeed {
  id: number;
  signaType: SignaType;
  text: string;
  count: number;
  comment?: string;
}

export class FaFeedback {
  comment: string;
  createdAt: Date;
  author: UserName;
  subject: FaFeedbackSubjectType;
}

export class FaTimeWindow {
  id: number;
  start: Date;
  end: Date;
}

export class BaseFt {
  id: number;
  name: string;
  status: FtStatus;
}

export class FaReview {
  user: UserName;
  team: Team;
}

export class FaReviewTeam {
  team: Team;
}

export class SitePublishAnimation {
  photoLink?: string;
  description?: string;
  isFlagship?: boolean;
  categories?: SitePublishAnimationCategoryType[];
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
  waterFlowRequired?: number;
  collaborator?: FaCollaborator;
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
