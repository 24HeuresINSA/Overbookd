import { FaFeedbackSubjectType } from 'src/fa-feedback/faFeedback.model';
import { ElectricityType } from 'src/fa_electricity_need/faElectricityNeed.model';
import { SignaType } from 'src/fa_signa_need/faSignaNeed.model';
import { SitePublishAnimationCategoryType } from 'src/fa_site_publish_animation/faSitePublishAnimation.model';
import { FtStatus } from 'src/ft/ft.model';

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
