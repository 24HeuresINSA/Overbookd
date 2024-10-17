import { STAFF, VOLUNTEER } from "../newcomer.js";

export type Volunteer = { email: string };
export type Candidate = Volunteer & {
  membership: typeof STAFF | typeof VOLUNTEER;
  edition: number;
  isRejected: boolean;
};

export type Candidates = {
  isCandidate(email: string, edition: number): Promise<boolean>;
  hasRejectedApplication(email: string, edition: number): Promise<boolean>;
  add(candidate: Candidate): Promise<void>;
  reject(email: string, edition: number): Promise<void>;
  cancelRejection(email: string, edition: number): Promise<void>;
};
