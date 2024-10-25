import { Membership, STAFF, VOLUNTEER } from "../newcomer.js";

export type Email = { email: string };
export type Candidate = Email & {
  membership: typeof STAFF | typeof VOLUNTEER;
  edition: number;
  isRejected: boolean;
  candidatedAt: Date;
};

export type Candidates = {
  isCandidate(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean>;
  isRejected(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean>;
  add(candidate: Candidate): Promise<void>;
  reject(email: string, edition: number, membership: Membership): Promise<void>;
  cancelRejection(
    email: string,
    edition: number,
    memebership: Membership,
  ): Promise<void>;
};
