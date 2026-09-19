import { Membership, STAFF, VOLUNTEER } from "../newcomer.js";

export type Candidate = {
  id: number;
  membership: typeof STAFF | typeof VOLUNTEER;
  edition: number;
  isRejected: boolean;
  candidatedAt: Date;
};

export type Candidates = {
  isCandidate(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<boolean>;
  isRejected(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<boolean>;
  add(candidate: Candidate): Promise<void>;
  reject(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<void>;
  cancelRejection(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<void>;
  switchApplicationMembership(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
    newMembership: Membership,
  ): Promise<void>;
};
