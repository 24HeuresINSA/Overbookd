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

type FaType =
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

export class UserName {
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

export class Collaborator {
  id: number;
  firstname?: string;
  lastname?: string;
  phone?: string;
  email?: string;
  company?: string;
  comment?: string;
}

export interface CompleteFaResponse {
  id: number;
  name: string;
  status: FaStatus;
  type?: FaType;
  team?: Team;
  userInCharge?: UserNameWithId;
  location?: SignaLocation;
  description: string;
  securityNeed: string;
  isPassRequired: boolean;
  numberOfPass?: number;
  waterNeed?: string;
  waterFlowRequired: string;
  isDeleted: boolean;
  collaborator: Collaborator;
}
